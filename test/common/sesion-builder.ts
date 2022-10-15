import { GraphQLClient } from 'graphql-request';
import { INestApplication } from '@nestjs/common';
import { getSdk, Sdk } from '../gql/queries';
import { agent } from 'supertest';
import { Response, Headers } from 'node-fetch';
import { createClient } from 'graphql-ws';
import * as ws from 'ws';
import { SubscriptionsQueries } from '../gql/subscriptions/subscriptions';

// eslint-disable-next-line @typescript-eslint/ban-types
type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };

export type SessionSdk = Sdk & { subscriptions: SubscriptionWsSdk };

export class SessionFactory {
  constructor(private app: INestApplication) {}

  async create() {
    const gqlSuffix = '/graphql';
    const graphQLClient = new GraphQLClient(gqlSuffix, {
      fetch: supertestFetch(this.app),
    });
    graphQLClient.setHeader('Authorization', 'verifySecondFactor.accessToken');
    const sdk = getSdk(graphQLClient);
    return {
      ...sdk,
      subscriptions: await getSubscriptionWsSdk(
        `ws://localhost:${this.app.getHttpServer().address().port}${gqlSuffix}`,
      ),
    } as unknown as SessionSdk;
  }
}

const supertestFetch = (app: INestApplication) => {
  const request = agent(app.getHttpServer());
  return (
    url: string,
    data: {
      method: string;
      headers: Record<string, string>;
      body: string;
    },
  ) => {
    return request[data.method.toLowerCase()](url)
      .set(data.headers)
      .send(JSON.parse(data.body))
      .then((response): Partial<Response> => {
        return {
          text: () => Promise.resolve(response.text),
          json: () => Promise.resolve(response.body),
          headers: new Headers(response.headers),
          ok: !response?.body?.errors,
          body: response.body,
          status: response.status,
        };
      });
  };
};

const createSecureWs = (idToken: string) =>
  class extends ws.WebSocket {
    constructor(address, protocols) {
      super(address, protocols, {
        headers: {
          authorization: `Bearer ` + idToken,
        },
      });
    }
  };

const createGqlSubscriptionClient = (url: string, authToken: string) => {
  return createClient({
    webSocketImpl: createSecureWs(authToken),
    url,
    retryAttempts: 100000,
    lazy: false,
    keepAlive: 10_000,
  });
};

type SubscriptionNames = keyof typeof SubscriptionsQueries;

type SubscriptionsRestSdk = Pick<Sdk, SubscriptionNames>;

type FirstArgumentType<F extends (...params: unknown[]) => unknown> =
  F extends (args: infer A) => any ? A : never;

type SubscriptionWsSdk = Resolve<{
  [K in keyof SubscriptionsRestSdk]: (
    param: FirstArgumentType<SubscriptionsRestSdk[K]>,
    cb: (
      type: Unpromise<ReturnType<SubscriptionsRestSdk[K]>>,
    ) => void | Promise<void>,
  ) => void;
}>;

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

async function getSubscriptionWsSdk(url: string): Promise<SubscriptionWsSdk> {
  const client = createGqlSubscriptionClient(url, '');
  const waitForConnection = () => new Promise((r) => client.on('connected', r));
  await waitForConnection();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Object.entries(SubscriptionsQueries).reduce(
    (prev, [name, query]: [string, string]) => ({
      ...prev,
      [name]: (variables, callback) => {
        client.subscribe(
          {
            query,
            variables,
          },
          {
            next(value) {
              callback(value.data);
            },
            error(error: unknown) {
              throw error;
            },
            complete() {
              console.log('done');
            },
          },
        );
      },
    }),
    {},
  );
}
