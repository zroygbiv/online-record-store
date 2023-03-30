import mongoose from "mongoose";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Record } from "../../../models/record";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@zroygbiv-ors/sharedcode";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Lazer Guided Melodies',
    price: 30
  });
  await record.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdgaf',
    expiresAt: new Date(),
    record
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, record, order, data, msg };
}

it('updates order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits OrderCancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});