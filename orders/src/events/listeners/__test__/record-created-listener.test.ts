import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { RecordCreatedListener } from "../record-created-listener";
import { RecordCreatedEvent } from "@zroygbiv-ors/sharedcode";
import { Record } from "../../../models/record";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create a listener
  const listener = new RecordCreatedListener(natsWrapper.client);
  // create a fake data event
  const data: RecordCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Lazer Guided Melodies",
    price: 30,
    userId: new mongoose.Types.ObjectId().toHexString()
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg };
}

it('creates and saves record', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const record = await Record.findById(data.id);

  expect(record).toBeDefined();
  expect(record!.title).toEqual(data.title);
  expect(record!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});