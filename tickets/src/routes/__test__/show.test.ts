import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

//Tests for retrieving ticket with specified Id Route

it('TC1.Returns a 404 if a ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('TC2.Returns a ticket if a ticket was found', async () => {
  const title = 'Pink Floyd concert 2022';
  const price = 500;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
