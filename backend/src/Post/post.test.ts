import { PostController } from './Post.controller';

const mockPost = {
  description: 'This is a post',
  likes: ['abc', 'def'],
  comments: [
    {
      content: 'What a great post',
      author: 'abc@example.com',
    },
  ],
  author: 'xyz@example.com',
};

jest.mock('../Post/Post.model.ts', () => ({
  PostModel: {
    findById() {
      return {
        async exec() {
          return mockPost;
        },
      };
    },
  },
}));

describe('PostController', () => {
  it('should return post object', async () => {
    expect(await PostController.getPost('foobar')).toMatchInlineSnapshot(`
      Object {
        "author": "xyz@example.com",
        "comments": Array [
          Object {
            "author": "abc@example.com",
            "content": "What a great post",
          },
        ],
        "description": "This is a post",
        "likes": Array [
          "abc",
          "def",
        ],
      }
    `);
  });
});
