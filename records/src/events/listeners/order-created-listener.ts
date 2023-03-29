import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@zroygbiv-ors/sharedcode";
import { queueGroupName } from "./queue-group-name";
import { Record } from "../../models/record";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find record that order is reserving
    const record = await Record.findById(data.record.id);
    if (!record) {
      throw new Error('Record not found');
    }
    // mark ticket reserved by setting orderId prop 
    record.set({ orderId: data.id });
    // save record
    await record.save();
    // ack message
    msg.ack();
  }
}