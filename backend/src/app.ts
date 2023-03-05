import express from 'express';
import createError from 'http-errors';
import path from 'path';
import passport from 'passport';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import initializePassport from './middlewares/passport-config.mw.js';
import indexRouter from './routes/index.js';

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

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DELETE LATER
app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.use('/', indexRouter);

app.listen(port, () => {
  console.log('Listening on port: ' + port);
});
