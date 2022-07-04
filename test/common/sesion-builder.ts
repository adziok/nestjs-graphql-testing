import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';
import { Response, Headers } from 'node-fetch';
import * as api from '../temp/sdk';

export type UserActions = typeof api;

export class SessionFactory {
  constructor(private app: INestApplication) {}

  async create() {
    api.defaults.headers = {
      access_token: 'secret',
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.defaults.fetch = supertestFetch(this.app);
    return api;
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
    return request[data.method?.toLowerCase() || 'get'](url)
      .set(data.headers)
      .send(data.body && JSON.parse(data.body))
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
