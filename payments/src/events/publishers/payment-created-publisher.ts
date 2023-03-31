import { Subjects, Publisher, PaymentCreatedEvent } from '@zroygbiv-ors/sharedcode';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}