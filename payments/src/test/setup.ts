import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
    }
  }
}
// jest.mock('../__mocks__/nats-wrapper.ts');
jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY =
  'sk_test_51HniAoAYUDdtgZfERhGfAzV3hQwJV09jQ3mdxsx2HNyo1jpfWCzJkOnSPBNPbGYTEW0dKHqCbQ5K7R8TkXSYXeMF00Cw2ft8Kr';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Step 1. Build a JWT payload  {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Step 2. Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Step 3. Building a session object
  const session = { jwt: token };

  //Step 4. Turn session into JSON

  const sessionJSON = JSON.stringify(session);

  // Step 5. Encoding a JSON session into base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //Step 6. Return the cookie with the encoded data as a string
  return [`express:sess=${base64}`];
};
