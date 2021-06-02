import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

//Tests for create ticket Route

it('TC1. Has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});
  // notFoundError has status code of 404
  expect(response.status).not.toEqual(404);
});
it('TC2. Can only be accessed if the user is signed in', async () => {
  //middlewares: current-user, require-auth
  //notAuthorizedError status 401
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('TC3. Returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  // console.log(response.status);
  expect(response.status).not.toEqual(401);
});
it('TC4. Returns an error if an invalid title is provided', async () => {
  //  middleware: validateRequest, error: requestValidationError
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ price: 10 })
    .expect(400);
});
it('TC5. Returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Pink Floyd concert 2022', price: -10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Pink Floyd concert 2022' })
    .expect(400);
});
it('TC6. Creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  const title = 'Pink Floyd concert 2022';
  const price = 500;
  expect(tickets.length).toEqual(0);
  // add a check to make sure the ticket was saved
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});
