import { GraphQLClient } from 'graphql-request';
import { INestApplication } from '@nestjs/common';
import { getSdk, Sdk } from '../gql/queries';
import { agent } from 'supertest';
import { Headers, Response } from 'node-fetch';
import { createClient } from 'graphql-ws';
import * as ws from 'ws';
import { SubscriptionsQueries } from '../gql/subscriptions/subscriptions';

export type UnPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Resolve<T> = T extends Function ? T : { [K in keyof T]: T[K] };

type SubscriptionsRestSdk = Pick<Sdk, keyof typeof SubscriptionsQueries>;

type SubscriptionWsSdk = Resolve<{
  [K in keyof SubscriptionsRestSdk]: (
    param: Parameters<SubscriptionsRestSdk[K]>[0],
    cb: (
      type: UnPromise<ReturnType<SubscriptionsRestSdk[K]>>,
      error: unknown,
    ) => void | Promise<void>,
  ) => void;
}>;

export type SessionSdk = Omit<Sdk, keyof typeof SubscriptionsQueries> &
  SubscriptionWsSdk;

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
      ...(await getSubscriptionWsSdk(
        `ws://localhost:${this.app.getHttpServer().address().port}${gqlSuffix}`,
      )),
    };
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
              callback(null, error);
            },
            complete() {
              return;
            },
          },
        );
      },
    }),
    {},
  );
}
