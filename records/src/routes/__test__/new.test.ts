import request from 'supertest';
import { app } from '../../app';
import { Record } from '../../models/record';

it('has route handler listening to /api/records for post requests', async () => {
  const response = await request(app)
    .post('/api/records')
    .send({});
  expect(response.statusCode).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  const response = await request(app)
    .post('/api/records')
    .send({});
  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({})
  expect(response.status).not.toEqual(401);
});

it('returns error if invalid title is provided', async () => {
  await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

it('returns error if invalid price is provided', async () => {
  await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfad',
      price: -10
    })
    .expect(400);
  
  await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfad'
    })
    .expect(400);
});

it('creates record with valid inputs', async () => {
  let records = await Record.find({});
  expect(records.length).toEqual(0);

  const title = 'asdgfghs';

  await request(app)
    .post('/api/records')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20
    })
    .expect(201);
  
  records = await Record.find({});
  expect(records.length).toEqual(1);
  expect(records[0].title).toEqual(title);
  expect(records[0].price).toEqual(20);
});