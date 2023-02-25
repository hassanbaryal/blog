import express from 'express';
import createError from 'http-errors';
import path from 'path';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import indexRouter from './routes/index.js';

dotenv.config();
const app = express();
const port = process.env.PORT || process.env.DEV_PORT;

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.listen(port, () => {
  console.log('Listening on port: ' + port);
});
