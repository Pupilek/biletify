import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('TC1. Fetching th order', async () => {
  // Step 1 - ticket creation
  const ticket = Ticket.build({ title: 'Pink Floyd concert 2022', price: 650 });
  await ticket.save();

  const user = global.signin();

  // Step 2 - make a request to build an order tich ticket

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Step 3 - make a request to fetch the order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
it('TC2. Fail if one user tries to fetch another users order', async () => {
  // Step 1 - ticket creation
  const ticket = Ticket.build({ title: 'Pink Floyd concert 2022', price: 650 });
  await ticket.save();

  const user = global.signin();

  // Step 2 - make a request to build an order tich ticket

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Step 3 - make a request to fetch the order

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
