import { Publisher, Subjects, TicketCreatedEvent } from '@albiletify/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
