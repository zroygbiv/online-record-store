import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if record not found', async () => {
  // generate valid object id
  const id =  new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/records/${id}`)
    .send()
    .expect(404)
;});

it('returns record if record is found', async () => {
  const title = 'concert';
  const price = 20;
  const response = await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      title, price
    })
    .expect(201);

  const recordResponse = await request(app)
    .get(`/api/records/${response.body.id}`)
    .send()
    .expect(200);

  expect(recordResponse.body.title).toEqual(title);
  expect(recordResponse.body.price).toEqual(price);
});
