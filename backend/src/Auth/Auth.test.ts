import 'dotenv/config';
import { AuthController } from './Auth.controller';

const mockUser = {
  email: 'JohnDoe@example.com',
  name: 'John',
  lastname: 'Doe',
  password: '$2b$08$KuNRY5slkLP/1xsZBM6nCuIDbkK2UniP.4/C1TLXw4VEXBWdT.dVm',
};

const mockMongooseUser = {
  ...mockUser,
  toObject() {
    return mockUser;
  },
};

jest.mock('../User/User.model.ts', () => ({
  UserModel: {
    findOne() {
      return {
        async exec() {
          return mockMongooseUser;
        },
      };
    },
    async create() {
      return mockMongooseUser;
    },
    async validate() {},
  },
}));

describe('AuthController', () => {
  it('should return user object without password entity', async () => {
    expect(await AuthController.getUserByEmail('JohnDoe@example.com'))
      .toMatchInlineSnapshot(`
      Object {
        "email": "JohnDoe@example.com",
        "lastname": "Doe",
        "name": "John",
      }
    `);
  });
  it('should return null when user try to sign in with wrong password', async () => {
    const userObject = await AuthController.signUser(
      'JohnDoe@example.com',
      'wrongpassword',
    );
    expect(userObject).toBeNull();
  });
  it('should return JWT after sign in', async () => {
    const userObject = await AuthController.signUser(
      'JohnDoe@example.com',
      'test',
    );
    expect(userObject).toBeTruthy();
  });
  it('should return user object without password entity when user sign up', async () => {
    const userObject = await AuthController.addUser({
      name: 'chuck',
      lastname: 'Norris',
      email: 'cn@gmail.com',
      password: 'test',
    });
    expect(userObject).toMatchInlineSnapshot(`
      Object {
        "email": "JohnDoe@example.com",
        "lastname": "Doe",
        "name": "John",
      }
    `);
  });
});
