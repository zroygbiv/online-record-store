import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Record } from '../../models/record';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the record does not exist', async () => {
  const recordId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId })
    .expect(404);
});

it('returns an error if the record is already reserved', async () => {
  // create new record
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  // create new order
  const order = Order.build({
    record,
    userId: 'fdsfdsg',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId: record.id })
    .expect(400);
});

it('reserves a record', async () => {
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId: record.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ recordId: record.id })
    .expect(201);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
