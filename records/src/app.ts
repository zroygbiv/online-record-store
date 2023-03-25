import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUser, errorHandler, NotFoundError } from '@zroygbiv-ors/sharedcode'
import { createRecordRouter } from './routes/new';
import { showRecordRouter } from './routes/show';
import { indexRecordRouter } from './routes';
import { updateRecordRouter } from './routes/update';


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
// create new record
app.use(createRecordRouter);
// show a record
app.use(showRecordRouter);
// show all records
app.use(indexRecordRouter);
// update record
app.use(updateRecordRouter);

// for routing all types of HTTP requests
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// bind error handler middleware to app object
app.use(errorHandler);

export { app };