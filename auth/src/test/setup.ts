import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../app';

declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;

// hook functions
beforeAll(async () => {
  process.env.JWT_KEY = 'adsfdsaf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

//auth helper function
global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, 
      password
    })
    .expect(201);
  
  const cookie = response.get('Set-Cookie');

  return cookie;
};