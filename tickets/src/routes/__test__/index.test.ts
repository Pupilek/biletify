import request from 'supertest';
import { app } from '../../app';

//Tests for retrieving all tickets Route

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Pink Floyd Concert 2022', price: 500 });
};

it('TC1.Can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(3);
});
