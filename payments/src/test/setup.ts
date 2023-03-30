import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
// hook functions
beforeAll(async () => {
  process.env.JWT_KEY = 'adsfdsaf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = (id?: string) => {
  // build JWT payload; id, email
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session obj; { jwt: MY_JWT }
  const session = { jwt: token };
  // turn session into JSON
  const sessionJSON = JSON.stringify(session);
  // take JSON; encode as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return string encoded data of cookie
  return [`session=${base64}`];
};