import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { RecordUpdatedListener } from "../record-updated-listener";
import { RecordUpdatedEvent } from "@zroygbiv-ors/sharedcode";
import { Record } from "../../../models/record";
import { natsWrapper } from "../../../nats-wrapper";

const setup = async () => {
  // create a listener
  const listener = new RecordUpdatedListener(natsWrapper.client);

  // create and save a record
  const record = Record.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Lazer Guided Melodies",
    price: 30
  });
  await record.save();

  // create fake data object
  const data: RecordUpdatedEvent['data'] = {
    id: record.id,
    version: record.version + 1,
    title: 'New Title',
    price: 99,
    userId: 'asdgh'
  };

  // create fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, record, data, msg };
};

it('find, update, and save a record', async () => {
  const { listener, record, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedRecord = await Record.findById(record.id);

  expect(updatedRecord!.title).toEqual(data.title);
  expect(updatedRecord!.price).toEqual(data.price);
  expect(updatedRecord!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack if event has unexpected version number', async () => {
  const { listener, data, msg, record } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {

  }

  expect(msg.ack).not.toHaveBeenCalled();
});