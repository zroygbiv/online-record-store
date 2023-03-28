import { Publisher, OrderCreatedEvent, Subjects } from "@zroygbiv-ors/sharedcode";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}