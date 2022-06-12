import 'dotenv/config';
import './Auth/Passport';
import fs from 'fs';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { AuthRouter } from './Auth/Auth.router';
import { UserRouter } from './User/User.router';
import { PostRouter } from './Post/Post.router';

const PORT = 5555;
const app = express();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

mongoose.connect(process.env.MONGO_DB_URL, () => {
  console.log('Connected to MongoDB server!');
});

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/posts', PostRouter);
app.get('/api/status', (_, res) => res.status(200).json({ ok: true }));

app.listen(PORT, () => {
  console.log('Server is listing on port', PORT);
});
