import 'cross-fetch/polyfill';
import prisma from '../src/prisma';

import seedDatabse, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { createUser, login, getProfile, getUsers } from './utils/operations';

const client =  getClient();

jest.setTimeout(30000);

beforeEach(seedDatabse);

test('Should create a new user', async () => {
  const variables = {
    data: {
      name: "Andrew",
      email: "andrew@example.com",
      password: "MyPass123"
    }
  }

 const response = await client.mutate({
    mutation: createUser,
    variables: variables
  });

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
  expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
})

test('Should login with good credentials', async () => {
  const variables = {
    data: {
      email: "jen@example.com",
      password: "nlue076#4343"
    }
  };

  await expect(
    client.mutate({ mutation: login, variables })
  ).resolves.not.toThrow();
});

test('Should not login with bad credentials', async () => {
  const variables = {
    data: {
      email: "jen@example.com",
      password: "nlue076#4355454"
    }
  }

  await expect(
    client.mutate({ mutation: login, variables })
  ).rejects.toThrow();
});

test('Should not signup with short password', async () => {
  const variables = {
    data: {
      name: 'Pink',
      email: 'pepa@example.com',
      password: '123'
    }
  };

  await expect(
    client.mutate({ mutation: createUser, variables })
  ).rejects.toThrow();
});

test('Should fetch user profile', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: getProfile });

  expect(data.me.id).toBe(userOne.user.id);
  expect(data.me.name).toBe(userOne.user.name);
  expect(data.me.email).toBe(userOne.user.email);
});
