import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@albiletify/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
