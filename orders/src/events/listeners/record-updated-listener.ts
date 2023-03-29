import { Message } from "node-nats-streaming";
import { Subjects, RecordUpdatedEvent, Listener } from "@zroygbiv-ors/sharedcode";
import { Record } from "../../models/record";
import { queueGroupName } from "./queue-group-name";

export class RecordUpdatedListener extends Listener<RecordUpdatedEvent> {
  subject: Subjects.RecordUpdated = Subjects.RecordUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: RecordUpdatedEvent['data'], msg: Message) {
    const record = await Record.findByEvent(data);

    if (!record) {
      throw new Error('Record not found');
    }

    const { title, price } = data;
    record.set({ title, price });
    await record.save();

    msg.ack();
  };
}