import { Message } from "node-nats-streaming";
import { Subjects, Listener, RecordCreatedEvent } from "@zroygbiv-ors/sharedcode";
import { Record } from "../../src/models/record";
import { queueGroupName } from "./queue-group-name";

export class RecordCreatedListener extends Listener<RecordCreatedEvent> {
  subject: Subjects.RecordCreated = Subjects.RecordCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: RecordCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const record = Record.build({
      id, title, price
    });
    await record.save();

    msg.ack();
  }
}