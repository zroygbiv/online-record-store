import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../order-created-listener";
import { Record } from "../../../models/record";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@zroygbiv-ors/sharedcode";

const setup = async () => {
  // create a listener
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create and save record
  const record = Record.build({
    title: 'Lazer Guided Melodies',
    price: 30,
    userId: 'asdf'  
  });
  await record.save();

  // create fake data object
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'adsgahfd',
    expiresAt: 'fdsagfd',
    record: {
      id: record.id,
      price: record.price,
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, record, data, msg };
}

it('sets userId of record', async () => {
  const { listener, record, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedRecord = await Record.findById(record.id);

  expect(updatedRecord!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, record, data, msg } = await setup();
  
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
