import { Publisher, OrderCreatedEvent, Subjects } from '@albiletify/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
