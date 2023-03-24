import { Publisher, Subjects, RecordCreatedEvent } from "@zroygbiv-ors/sharedcode";

export class RecordCreatedPublisher extends Publisher<RecordCreatedEvent> {
  subject: Subjects.RecordCreated = Subjects.RecordCreated;
}
