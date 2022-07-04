import { createTestingApp } from './common/test-setup';
import { UserActions } from './common/sesion-builder';

describe('AppController (e2e)', () => {
  let session: UserActions;

  beforeEach(async () => {
    const { sessionFactory } = await createTestingApp();
    session = await sessionFactory.create();
  });

  it('should create a user', async () => {
    await session.appControllerCreateUser({
      name: 'User1',
      location: {
        country: 'Poland',
        city: 'Warsaw',
      },
    });
    const { data } = await session.appControllerListUsers();

    expect(data).toEqual(
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
    const { data: userId } = await session.appControllerCreateUser({
      name: 'User1',
      location: {
        country: 'Poland',
        city: 'Warsaw',
      },
    });
    await session.appControllerUpdateUser(userId, {
      name: 'UpdatedUser1',
      location: {
        country: 'Poland',
        city: 'Warsaw',
      },
    });
    const { data } = await session.appControllerListUsers();

    expect(data).toEqual(
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
    const { data: userId } = await session.appControllerCreateUser({
      name: 'User1',
      location: {
        country: 'Poland',
        city: 'Warsaw',
      },
    });
    await session.appControllerDeleteUser(userId);
    const { data } = await session.appControllerListUsers();

    expect(data.length).toEqual(0);
  });
});
