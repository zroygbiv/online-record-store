import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Record } from '../../models/record';

const buildRecord = async () => {
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  return record;
};

it('fetches orders for an particular user', async () => {
  // create three records
  const recordOne = await buildRecord();
  const recordTwo = await buildRecord();
  const recordThree = await buildRecord();
  const userOne = global.signin();
  const userTwo = global.signin();

  // create one order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ recordId: recordOne.id })
    .expect(201);

  // create two orders as user #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ recordId: recordTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ recordId: recordThree.id })
    .expect(201);

  // make request to get orders for user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  // ensure only orders for user #2 received
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(orderOne.id);
  expect(response.body[1].id).toEqual(orderTwo.id);
  expect(response.body[0].record.id).toEqual(recordTwo.id);
  expect(response.body[1].record.id).toEqual(recordThree.id);
});
