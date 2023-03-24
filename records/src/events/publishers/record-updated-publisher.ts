import { Publisher, Subjects, RecordUpdatedEvent } from "@zroygbiv-ors/sharedcode";

export class RecordUpdatedPublisher extends Publisher<RecordUpdatedEvent> {
  subject: Subjects.RecordUpdated = Subjects.RecordUpdated;
}