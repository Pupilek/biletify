import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
//stan -client in NATS terminology
const stan = nats.connect('biletify', 'abc', { url: 'http://localhost:4222' });

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({ id: '123', title: 'concert', price: 50 });
  } catch (err) {
    console.error(err);
  }

  // we can share only strings, not objects
  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
