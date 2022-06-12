import mongoose from 'mongoose';

export const PostModel = mongoose.model(
  'Post',
  new mongoose.Schema({
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
    },
    comments: [
      {
        content: { type: String },
        author: { type: String },
      },
    ],
    author: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  }),
);
