import express from 'express';
import passport from 'passport';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import initializePassport from './middlewares/passport-config.mw.js';
import indexRouter from './routes/index.js';
import postRouter from './routes/post.js';
import commentRouter from './routes/comment.js';

dotenv.config();
const app = express();
const port = process.env.PORT || process.env.DEV_PORT;

// Connect to Mongo DB
mongoose.set('strictQuery', false);
const mongoURI: any = process.env.MONGODB_URI || process.env.DEV_MONGODB_URI;

try {
  await mongoose.connect(mongoURI);
} catch (err: any) {
  throw new Error(err);
}

initializePassport(passport);
import './middlewares/verifyToken.mw.js';

app.use(compression());
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173"
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/comment', commentRouter);
app.use('/post', postRouter);
app.use('/', indexRouter);

app.listen(port, () => {
  console.log('Listening on port: ' + port);
});
