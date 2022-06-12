import { PostModel } from './Post.model';

export const PostController = {
  async getPost(id) {
    return await PostModel.findById(id).exec();
  },

  async updatePost(id, postBody) {
    return await PostModel.findByIdAndUpdate(id, postBody);
  },

  async getPosts() {
    const posts = await PostModel.find().exec();
    return posts;
  },

  async getOnePost(id) {
    const post = await PostModel.findById(id).exec();
    return post ?? null;
  },

  async getAuthorPosts(authorId) {
    const authorPosts = await PostModel.find({ author: authorId }).exec();
    return authorPosts;
  },

  async addPost(post) {
    await PostModel.validate(post);
    return await PostModel.create(post);
  },

  async deletePost(id) {
    return await PostModel.findByIdAndRemove(id).exec();
  },

  async addComment(postID, comment) {
    const post = await PostController.getPost(postID);
    post.comments.push(comment);
    await PostController.updatePost(postID, post);
    const updatedPost = await PostController.getPost(postID);
    return updatedPost.comments;
  },

  async deleteComment(postID, commentID) {
    const post = await PostController.getPost(postID);
    post.comments = post.comments.filter((comment) => comment.id !== commentID);
    await PostController.updatePost(postID, post);
    const updatedPost = await PostController.getPost(postID);
    return updatedPost.comments;
  },

  async deleteLike(userEmail, postId) {
    const post = await PostController.getPost(postId);
    post.likes = post.likes.filter((email) => email !== userEmail);
    await PostController.updatePost(postId, post);
    const updatedPost = await PostController.getPost(postId);
    return updatedPost.likes;
  },

  async addLike(postId, userEmail) {
    const post = await PostController.getPost(postId);
    post.likes.push(userEmail);
    await PostController.updatePost(postId, post);
    const updatedPost = await PostController.getPost(postId);
    return updatedPost.likes;
  },
};
