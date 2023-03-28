import { Subjects } from './subjects';

export interface RecordUpdatedEvent {
  subject: Subjects.RecordUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
