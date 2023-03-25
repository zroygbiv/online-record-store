import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@zroygbiv-ors/sharedcode'
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

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
// delete order
app.use(deleteOrderRouter);
// show all orders
app.use(indexOrderRouter);
// create order
app.use(newOrderRouter);
// show order
app.use(showOrderRouter);

// for routing all types of HTTP requests
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// bind error handler middleware to app object
app.use(errorHandler);

export { app };