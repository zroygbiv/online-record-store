import { Subjects, Publisher, ExpirationCompleteEvent } from "@zroygbiv-ors/sharedcode";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
}