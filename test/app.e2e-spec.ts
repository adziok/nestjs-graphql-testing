import { createTestingApp } from './common/test-setup';
import { Sdk } from './gql/queries';

describe('AppController (e2e)', () => {
  let session: Sdk;

  beforeEach(async () => {
    const { sessionFactory } = await createTestingApp();
    session = await sessionFactory.create();
  });

  it('should create a user', async () => {
    await session.createUser({
      input: {
        name: 'User1',
        location: {
          country: {
            name: 'Poland',
            code: 'Pl',
          },
          city: 'Warsaw',
        },
        bestFriend: {
          name: 'Tom',
          location: {
            country: {
              name: 'Poland',
              code: 'Pl',
            },
            city: 'Cracow',
          },
        },
      },
    });
    const { listUsers } = await session.listUsers();

    expect(listUsers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'User1',
          location: {
            country: {
              name: 'Poland',
              code: 'Pl',
            },
            city: 'Warsaw',
          },
          bestFriend: {
            name: 'Tom',
            location: {
              country: {
                name: 'Poland',
                code: 'Pl',
              },
              city: 'Cracow',
            },
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
          country: {
            name: 'Poland',
            code: 'Pl',
          },
          city: 'Warsaw',
        },
        bestFriend: {
          name: 'Tom',
          location: {
            country: {
              name: 'Poland',
              code: 'Pl',
            },
            city: 'Cracow',
          },
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
            country: {
              name: 'Poland',
              code: 'Pl',
            },
            city: 'Warsaw',
          },
          bestFriend: {
            name: 'Tom',
            location: {
              country: {
                name: 'Poland',
                code: 'Pl',
              },
              city: 'Cracow',
            },
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
          country: {
            name: 'Poland',
            code: 'Pl',
          },
          city: 'Warsaw',
        },
        bestFriend: {
          name: 'Tom',
          location: {
            country: {
              name: 'Poland',
              code: 'Pl',
            },
            city: 'Cracow',
          },
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
