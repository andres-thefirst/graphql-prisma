import 'cross-fetch/polyfill';

import seedDatabse, {userOne, commentOne, commentTwo} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';
import {deleteComment } from './utils/operations';

jest.setTimeout(30000);

beforeEach(seedDatabse);

test('Should delete own comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentTwo.comment.id
  };

  await client.mutate({ mutation: deleteComment , variables});
  const exists = await prisma.exists.Comment({ id: commentTwo.comment.id });
  expect(exists).toBe(false);
});

test('Should not delete other users comment', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: commentOne.comment.id
  };

  await expect(
    client.mutate({ mutation: deleteComment , variables})
  ).rejects.toThrow();
});