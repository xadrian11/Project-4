import { UserModel } from './User.model';
import omit from 'lodash.omit';

export const UserController = {
  async getUsers() {
    const users = await UserModel.find().exec();
    return users.map((user) => omit(user.toObject(), ['password']));
  },
  async getUser(id) {
    const user = await UserModel.findById(id).exec();
    return omit(user.toObject(), ['password']);
  },
  async updateUser(id, userBody) {
    const user = await UserModel.findByIdAndUpdate(id, userBody);
    return omit({ ...user.toObject(), ...userBody }, ['password']);
  },
  async deleteUser(id) {
    return await UserModel.findByIdAndRemove(id);
  },
  async findFollowers(id) {
    const user = await UserModel.findById(id).exec();
    const followers = user.following;
    return followers.toObject();
  },
};
