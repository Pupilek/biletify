import { Ticket } from '../ticket';

it('TC1. Implements optimistic concurrency control', async (done) => {
  //Step 1. Create a Tickt instance

  const ticket = Ticket.build({
    title: 'Pink Floyd concert 2022',
    price: 850,
    userId: 'randomId',
  });

  //Step 2. Save the ticket to database

  await ticket.save();

  //Step 3. Fetch the ticket twice.

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //Step4. Make different changes for al tickets.

  firstInstance!.set({ price: 1000 });
  secondInstance!.set({ price: 2000 });

  //Step 5. Save the first fetched ticket

  await firstInstance!.save();

  //Step 6. Save the second fetched ticket and expect an error.

  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }
  throw new Error('Should not reach this point');
});

it('TC2. Intrementing the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Pink Floyd concert 2022',
    price: 850,
    userId: 'randomId',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
