import { Listener, OrderCancelledEvent, Subjects } from "@zroygbiv-ors/sharedcode";
import { Message } from "node-nats-streaming";
import { Record } from "../../models/record";
import { RecordUpdatedPublisher } from "../publishers/record-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const record = await Record.findById(data.record.id);

    if (!record) {
      throw new Error('Record not found');
    }

    record.set({ orderId: undefined });
    
    await record.save();

    await new RecordUpdatedPublisher(this.client).publish({
      id: record.id,
      version: record.version,
      title: record.title,
      price: record.price,
      orderId: record.orderId,
      userId: record.userId
    });

    msg.ack();
  };
}