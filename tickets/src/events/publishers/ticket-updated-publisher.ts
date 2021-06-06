import { Publisher, Subjects, TicketUpdatedEvent } from '@albiletify/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
