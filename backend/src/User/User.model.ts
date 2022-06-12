import mongoose from 'mongoose';

export const UserModel = mongoose.model(
  'User',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    following: {
      type: Array,
    },
    avatarURL: {
      type: String,
    },
  }),
);
