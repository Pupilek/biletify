import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@albiletify/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Step 1. Create an instance of the listener.

  const listener = new TicketUpdatedListener(natsWrapper.client);

  //Step 2. Create and save a ticket.

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Pink Floyd concert 2022',
    price: 750,
  });

  await ticket.save();

  //Step 3. Create a fake data object.

  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 900,
    userId: 'randomId',
  };

  //Step 3. Create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket };
};

it('TC 1. Finds, updates and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('TC2. Acks the message', async () => {
  const { msg, data, listener } = await setup();

  //Step 4. Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //Step 5. Write assertions to make sure ack function is called.
  expect(msg.ack).toHaveBeenCalled();
});

it('TC3. Does not cal ack if the event has a skipped version number', async () => {
  const { msg, data, listener } = await setup();
  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
