import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import seedDatabse, {userOne, postOne} from './utils/seedDatabase';
import getClient from './utils/getClient';
import prisma from '../src/prisma';

const client =  getClient();

beforeEach(seedDatabse);

test('Should expose only published posts', async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        published 
      }
    }
  `;

  const response = await client.query({ query: getPosts });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].title).toBe('The first reason why');
  expect(response.data.posts[0].published).toBe("true");
});

test('Should retrieve users posts', async () => {
  const client = getClient(userOne.jwt);
  const myPosts = gql`
    query {
      myPosts {
        id
        title
        body
        published
      }
    }
  `;

const  { data } = await client.query({ query: myPosts });
expect(data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async () => {
  const client = getClient(userOne.jwt);
  const updatePost = gql`
    mutation {
      updatePost(
        id: "${postOne.post.id}",
        data: {
          published: false
        }
      ) {
        id
        title
        body
        published
      }
    }
  `;

  const { data } = await client.mutate({ mutation: updatePost });
  const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });
  expect(data.updatePost.published).toBe("false");
  expect(exists).toBe(true);
})

test('Should create a new post', async () => {
  const title = "Test post from unit tests";
  const body = "body from unit tests";
  const client = getClient(userOne.jwt);
  const createPost = gql`
    mutation {
      createPost(
        data: {
          title: "${title}"
          body: "${body}"
          published: true
        }
      ) {
        id
        title
        body
        published
        author {
          name
        }
      }
    }
  `;

  const { data } = await client.mutate({ mutation: createPost });
  expect(data.createPost.title).toBe(title);
  expect(data.createPost.body).toBe(body);
  expect(data.createPost.published).toBe("true");
});

test('Should delete a post', async () => {
  const client = getClient(userOne.jwt);
  const deletePost = gql`
    mutation {
      deletePost(
        id: "${postOne.post.id}"
      ) {
        id
        title
        body
        published
      }
    }
  `;

  await client.mutate({ mutation: deletePost });
  const exists = await prisma.exists.Post({ id: postOne.post.id });
  expect(exists).toBe(false);
});