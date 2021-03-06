import 'cross-fetch/polyfill';

import seedDatabse, {userOne, postOne, postTwo} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';
import {getPosts, myPosts, updatePost, createPost, deletePost } from './utils/operations';

const client =  getClient();

jest.setTimeout(30000);

beforeEach(seedDatabse);

test('Should expose only published posts', async () => {
  const response = await client.query({ query: getPosts });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].title).toBe('The first reason why');
  expect(response.data.posts[0].published).toBe("true");
});

test('Should retrieve users posts', async () => {
  const client = getClient(userOne.jwt);
const  { data } = await client.query({ query: myPosts });
expect(data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const variables = {
    id: postOne.post.id,
    data: {
      published: false
    }
  };
  const { data } = await client.mutate({ mutation: updatePost, variables });
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });
  expect(data.updatePost.published).toBe("false");
  expect(exists).toBe(true);
})

test('Should create a new post', async () => {
  const title = "Test post from unit tests";
  const body = "body from unit tests";
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      title, body,
      published: true
    }
  }

  const { data } = await client.mutate({ mutation: createPost, variables });
  expect(data.createPost.title).toBe(title);
  expect(data.createPost.body).toBe(body);
  expect(data.createPost.published).toBe("true");
});

test('Should delete a post', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: postTwo.post.id
  };

  await client.mutate({ mutation: deletePost , variables});
  const exists = await prisma.exists.Post({ id: postTwo.post.id });
  expect(exists).toBe(false);
});
