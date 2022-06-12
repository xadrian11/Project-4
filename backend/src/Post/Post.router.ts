import { Router } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import { PostController } from './Post.controller';
import '../Auth/Passport';
import { uploadImg } from '../lib/firebase';
import { multer } from '../lib/multer';

const upload = multer({ dest: 'uploads/' });

export const PostRouter = Router();

PostRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    const post = await PostController.getPost(req.params.id);

    if (req.user.email !== post.author) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      await PostController.updatePost(req.params.id, req.body);
      res.status(StatusCodes.ACCEPTED).json({ message: 'Post updated' });
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

PostRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const posts = await PostController.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

PostRouter.get(
  '/timeline',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const usersPosts = [];
      const authorPosts = await PostController.getAuthorPosts(req.user.id);
      usersPosts.push(authorPosts);
      const followers = req.user.following;
      for (const follower of followers) {
        const followerPosts = await PostController.getAuthorPosts(follower);
        usersPosts.push(followerPosts);
      }
      const sortedPosts = usersPosts.flat().sort(function compare(a, b) {
        return b.date - a.date;
      });
      const timelinePosts = sortedPosts.flat();
      res.status(StatusCodes.ACCEPTED).json(timelinePosts);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).send();
    }
  },
);

PostRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await PostController.getPost(req.params.id);
      res.status(StatusCodes.OK).json(post);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

PostRouter.get(
  '/author/:authorId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const authorPosts = await PostController.getAuthorPosts(
        req.params.authorId === 'me' ? req.user.id : req.params.authorId,
      );
      if (authorPosts.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ error: 'Not Found' });
      } else {
        res.status(StatusCodes.OK).json(authorPosts);
      }
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

PostRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('imgFile'),
  async (req, res) => {
    try {
      const newPost = await PostController.addPost({
        description: req.body.description,
        postImage: await uploadImg(req.file.path),
        author: req.user.id,
        date: new Date(),
      });
      res.status(StatusCodes.ACCEPTED).json(newPost);
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }
    }
  },
);

PostRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const post = await PostController.deletePost(req.params.id);
      res.status(StatusCodes.NO_CONTENT).json(post);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

PostRouter.delete(
  '/:id/likes',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const userEmail = req.user.email;
      const postId = req.params.id;
      const updatedLikes = await PostController.deleteLike(userEmail, postId);
      res.status(StatusCodes.ACCEPTED).json(updatedLikes);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json(error.message);
    }
  },
);

PostRouter.post(
  '/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const postID = req.params.postId;
      const comment = {
        content: req.body.content,
        author: req.user.id,
      };
      const updatedComments = await PostController.addComment(postID, comment);
      res.status(StatusCodes.CREATED).json(updatedComments);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: 'Not Found' });
    }
  },
);

PostRouter.post(
  '/:id/likes',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const postId = req.params.id;
      const userEmail = req.user.email;
      const post = await PostController.getOnePost(postId);
      if (post === null) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Not Found' });
      }
      const updatedLikes = await PostController.addLike(postId, userEmail);
      res.status(StatusCodes.ACCEPTED).json(updatedLikes);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  },
);

PostRouter.delete(
  '/:postId/comments/:commentId',
  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    try {
      const postID = req.params.postId;
      const commentID = req.params.commentId;
      await PostController.deleteComment(postID, commentID);
      res.status(StatusCodes.NO_CONTENT).json({});
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
  },
);
