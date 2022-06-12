import { UserController } from './User.controller';
import { UserModel } from './User.model';

const mockUser = {
  email: 'yoyo@yo.com',
  name: 'John',
  lastname: 'Doe',
  password: 'sdfghg',
  following: ['625045e47e9b68ab1189a4aa', '624df1beb3cb2e07b1f53f0a'],
};

const mockMongoUser = {
  ...mockUser,
  toObject() {
    return mockUser;
  },
};

jest.mock('./User.model.ts', () => ({
  UserModel: {
    findById: jest.fn(() => {
      return {
        async exec() {
          return mockMongoUser;
        },
      };
    }),
    find: jest.fn(() => {
      return {
        async exec() {
          return [mockMongoUser, mockMongoUser];
        },
      };
    }),
    findByIdAndUpdate: jest.fn(async () => {
      return mockMongoUser;
    }),
    findByIdAndRemove: jest.fn(async () => {
      return null;
    }),
  },
}));

describe('UserController', () => {
  it('should return a user by id', async () => {
    const userId = 'foobar';
    const user = await UserController.getUser(userId);

    expect(UserModel.findById).toHaveBeenCalledWith(userId);
    expect(user).toMatchInlineSnapshot(`
      Object {
        "email": "yoyo@yo.com",
        "following": Array [
          "625045e47e9b68ab1189a4aa",
          "624df1beb3cb2e07b1f53f0a",
        ],
        "lastname": "Doe",
        "name": "John",
      }
    `);
  });

  it('should return list of users', async () => {
    expect(await UserController.getUsers()).toMatchInlineSnapshot(`
      Array [
        Object {
          "email": "yoyo@yo.com",
          "following": Array [
            "625045e47e9b68ab1189a4aa",
            "624df1beb3cb2e07b1f53f0a",
          ],
          "lastname": "Doe",
          "name": "John",
        },
        Object {
          "email": "yoyo@yo.com",
          "following": Array [
            "625045e47e9b68ab1189a4aa",
            "624df1beb3cb2e07b1f53f0a",
          ],
          "lastname": "Doe",
          "name": "John",
        },
      ]
    `);
  });

  it('should update user', async () => {
    const userId = 'foobar';
    const payload = { email: 'test231@test.pl' };
    const update = await UserController.updateUser(userId, payload);

    expect(update).toBeTruthy();
    expect(update).toMatchInlineSnapshot(`
      Object {
        "email": "test231@test.pl",
        "following": Array [
          "625045e47e9b68ab1189a4aa",
          "624df1beb3cb2e07b1f53f0a",
        ],
        "lastname": "Doe",
        "name": "John",
      }
    `);
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, payload);
  });

  it('Should delete user by id', async () => {
    const userId = 'foobar';
    const deleteUser = await UserController.deleteUser(userId);

    expect(deleteUser).toBeNull();
    expect(UserModel.findByIdAndRemove).toHaveBeenCalledWith(userId);
  });
});
