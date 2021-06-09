import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@albiletify/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Step 1. Create an instance of the listener.

  const listener = new TicketCreatedListener(natsWrapper.client);

  //Step 2. Create a fake data event.

  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Pink Floyd Concert 2022',
    price: 750,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //Step 3. Create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('TC 1. Creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  //Step 4. Call the onMessage function with the data object + message object

  await listener.onMessage(data, msg);

  //Step 5. Write assertions to make sure a ticket was created

  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('TC 2. Acks the message', async () => {
  const { listener, data, msg } = await setup();

  //Step 4. Call th onMessage function with the data object + message object

  await listener.onMessage(data, msg);

  //Step 5. Write assertions to make sure ack function is called.

  expect(msg.ack).toHaveBeenCalled();
});
