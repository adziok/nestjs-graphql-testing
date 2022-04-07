import { INestApplication } from '@nestjs/common';
import { createTestingApp } from './common/test-setup';
import { SessionFactory } from './common/sesion-builder';
import { Sdk } from './gql/queries';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let sessionFactor: SessionFactory;
  let session: Sdk;

  beforeAll(async () => {
    const { app: _app, sessionFactory: _sessionFactory } =
      await createTestingApp();
    app = _app;
    sessionFactor = _sessionFactory;
  });

  beforeEach(async () => {
    session = await sessionFactor.create();
  });

  it('should create a user', async () => {
    await session.createUser({
      input: {
        name: 'User1',
        location: {
          country: 'Poland',
          city: 'Warsaw',
        },
      },
    });
    const { listUsers } = await session.listUsers();

    expect(listUsers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'User1',
          location: {
            country: 'Poland',
            city: 'Warsaw',
          },
        }),
      ]),
    );
  });
});
