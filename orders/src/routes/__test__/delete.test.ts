import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Record } from '../../models/record';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
  // create a record
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  const user = global.signin();
  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ recordId: record.id })
    .expect(201);

  // make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // confirm order was deleted/cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  // create a record
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 20,
  });
  await record.save();

  const user = global.signin();
  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ recordId: record.id })
    .expect(201);

  // make request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);  

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
