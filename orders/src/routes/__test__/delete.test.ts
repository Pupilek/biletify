import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('TC1. Marks an order as cancelled', async () => {
  // Step 1. Create a ticket
  const ticket = Ticket.build({
    title: 'Pink Floyd Concert 2022',
    price: 1000,
  });
  await ticket.save();

  const user = global.signin();

  // Step 2. Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Step 3. Make a request to cancell the order

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  // Step 4. Making an expectation to make sure the thing is cancelled

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('TC2. Emits a order cancelled event', async () => {
  const ticket = Ticket.build({
    title: 'Pink Floyd Concert 2022',
    price: 1000,
  });
  await ticket.save();

  const user = global.signin();

  // Step 2. Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Step 3. Make a request to cancell the order

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
