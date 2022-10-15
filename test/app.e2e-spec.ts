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

  it('sub', async () => {
    (
      await session.userCreated({ filter: { onlyIfNameContains: 'a' } })
    ).userCreated.session.subscriptions.userCreated(
      { filter: { onlyIfNameContains: 'User' } },
      (v) => {
        console.log(v);
      },
    );

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
    await sleep(1000);
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

  it('should update a user', async () => {
    const { createUser } = await session.createUser({
      input: {
        name: 'User1',
        location: {
          country: 'Poland',
          city: 'Warsaw',
        },
      },
    });
    await session.updateUser({
      input: {
        name: 'UpdatedUser1',
      },
      userId: createUser,
    });
    const { listUsers } = await session.listUsers();

    expect(listUsers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'UpdatedUser1',
          location: {
            country: 'Poland',
            city: 'Warsaw',
          },
        }),
      ]),
    );
  });

  it('should delete a user', async () => {
    const { createUser } = await session.createUser({
      input: {
        name: 'User1',
        location: {
          country: 'Poland',
          city: 'Warsaw',
        },
      },
    });
    await session.deleteUser({
      userId: createUser,
    });
    const { listUsers } = await session.listUsers();

    expect(listUsers.length).toEqual(0);
  });
});
