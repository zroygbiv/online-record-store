import request from 'supertest';
import { app } from '../../app';
import { Record } from '../../models/record';

it('fetches the order', async () => {
  // create new record
  const record = Record.build({
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  const user = global.signin();
  // make request to build order with new record
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ recordId: record.id })
    .expect(201);

  // make request to fetch order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
  // create new record
  const record = Record.build({
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  const user = global.signin();
  // make a request to build an order with new record
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ recordId: record.id })
    .expect(201);

  // make request to fetch order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
