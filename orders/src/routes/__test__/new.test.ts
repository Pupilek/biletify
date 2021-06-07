import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('TC1. Returns an error if the ticket does not exists', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('TC2. Returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Pink Floyd Concert 2022',
    price: 750,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'randomId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('TC3. Reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Pink Floyd Concert 2022',
    price: 750,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('TC4. Emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'Pink Floyd Concert 2022',
    price: 750,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
