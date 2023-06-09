import { Subjects } from './subjects';

export interface RecordCreatedEvent {
  subject: Subjects.RecordCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
