import { createTestingApp } from './common/test-setup';
import { SessionSdk } from './common/sesion-builder';
import { INestApplication } from '@nestjs/common';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

describe('AppController (e2e)', () => {
  let session: SessionSdk;
  let app: INestApplication;

  beforeEach(async () => {
    const { sessionFactory, app: _app } = await createTestingApp();
    session = await sessionFactory.create();
    app = _app;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should notify about created user via subscription', async () => {
    const subscriptionSpy = jest.fn();
    session.userCreated({ filter: { onlyIfNameContains: 'User' } }, (v) => {
      subscriptionSpy(v);
    });

    await session.createUser({
      input: {
        name: 'User1',
        location: {
          country: 'Poland',
          city: 'Warsaw',
        },
      },
    });
    await sleep(1000);

    expect(subscriptionSpy).toBeCalledWith({
      userCreated: {
        id: expect.any(String),
        name: 'User1',
        location: { country: 'Poland', city: 'Warsaw' },
      },
    });
  });

  it('should not notify about user creation when filter doesnt match', async () => {
    const subscriptionSpy = jest.fn();
    session.userCreated({ filter: { onlyIfNameContains: 'User' } }, (v) => {
      subscriptionSpy(v);
    });

    await session.createUser({
      input: {
        name: 'NameDifferentThanFilter',
        location: {
          country: 'Poland',
          city: 'Warsaw',
        },
      },
    });
    await sleep(1000);

    expect(subscriptionSpy).not.toBeCalled();
  });
});
