import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/records/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdfsgj',
      price: 20
    })
    .expect(404);
});

it('returns a 401 if user not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/records/${id}`)
    .send({
      title: 'asdfsgj',
      price: 20
    })
    .expect(401);
});

it('returns a 401 if user does not own record', async () => {
  const response = await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      title:'asdfsgj',
      price: 20
    });

  await request(app)
    .put(`/api/records/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'fdsagfsdafg',
      price: 30
    })
    .expect(401);
});

it('returns a 400 if user provides invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/records')
    .set('Cookie', cookie)
    .send({
      title:'asdfsgj',
      price: 20
    });

  await request(app)
    .put(`/api/records/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400);

  await request(app)
    .put(`/api/records/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asdfgf',
      price: -10
    })
    .expect(400);
});

it('updates record provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/records')
    .set('Cookie', cookie)
    .send({
      title:'asdfsgj',
      price: 20
    });

  await request(app)
    .put(`/api/records/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  const recordResponse = await request(app)
    .get(`/api/records/${response.body.id}`)
    .send();
  
  expect(recordResponse.body.title).toEqual('new title');
  expect(recordResponse.body.price).toEqual(100);
});

it('successfully publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/records')
    .set('Cookie', cookie)
    .send({
      title:'asdfsgj',
      price: 20
    });

  await request(app)
    .put(`/api/records/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});