import { OrderCancelledEvent } from "@zroygbiv-ors/sharedcode";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Record } from "../../../models/record";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const record = Record.build({
    title: 'Lazer Guided Melodies',
    price: 30,
    userId: 'asdgs',
  });
  record.set({ orderId });
  
  await record.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    record: {
      id: record.id
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, record, orderId, data, msg }; 
};

it('updates record, publishes event, acks the message', async () => {
  const { listener, record, orderId, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedRecord = await Record.findById(record.id);
  expect(updatedRecord!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish)
});
