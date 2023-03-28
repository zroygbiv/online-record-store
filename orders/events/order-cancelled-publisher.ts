import { Publisher, OrderCancelledEvent, Subjects } from "@zroygbiv-ors/sharedcode";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}