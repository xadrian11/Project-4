import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserController } from './User.controller';
import passport from 'passport';
import { multer } from '../lib/multer';
import { uploadImg } from '../lib/firebase';

const upload = multer({ dest: 'uploads/' });

export const UserRouter = Router();

UserRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const users = await UserController.getUsers();
      res.json(users);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  },
);

UserRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const user = await UserController.getUser(id);
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

UserRouter.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  upload.single('imgFile'),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const updatedUser = await UserController.updateUser(id, {
        ...req.body,
        ...(req.file && { avatarURL: await uploadImg(req.file.path) }),
      });
      res.status(StatusCodes.ACCEPTED).json(updatedUser);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  },
);

UserRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const user = await UserController.deleteUser(id);
      res.status(StatusCodes.NO_CONTENT).json(user);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);

UserRouter.get(
  '/:id/following',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const id = req.params.id === 'me' ? req.user.id : req.params.id;
    try {
      const followers = await UserController.findFollowers(id);
      res.status(StatusCodes.OK).json(followers);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  },
);
