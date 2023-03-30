import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createChargeRouter } from './routes/new-charge';

import { currentUser, errorHandler, NotFoundError } from '@zroygbiv-ors/sharedcode'

// instantiation of express application
const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);

app.use(createChargeRouter);

// for routing all types of HTTP requests
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// bind error handler middleware to app object
app.use(errorHandler);

export { app };