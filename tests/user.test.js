import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from 'bcryptjs';
import prisma from '../src/prisma';


const client =  new ApolloBoost({
  uri: 'http://localhost:4000'
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
 const user =  await prisma.mutation.createUser({
    data: {
      name: 'Jen',
      email: 'jen@example.com',
      password: bcrypt.hashSync('nlue076#4343')
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "The first reason why",
      body: "Is the thinking...",
      published: true,
      author: {connect: {id: user.id}}
    }
  })
  await prisma.mutation.createPost({
    data: {
      title: "Past and future",
      body: "Uncertain time",
      published: false,
      author: {connect: {id: user.id}}
    }
  })
});

test('Should create a new user', async () => {
  const createUser = gql`
    mutation {
        createUser(
          data: {
            name: "Andrew",
            email: "andrew@example.com",
            password: "MyPass123"
          }
        ) {
          token,
          user {
            id
          }
        }
    }
  `;

 const response = await client.mutate({
    mutation: createUser
  });

  const exists = await prisma.exists.User({ id: response.data.createUser.user.id });
  expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email 
      }
    }
  `;

  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe('Jen');
})

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

test('Should not 2 login with bad credentials', async () => {
  const login = gql`
    mutation {
      login(
        data: {
          email: "jen@example.com",
          password: "nlue076#4343"
        }
      ){
        token
      }
  }`;

  await expect(
    client.mutate({ mutation: login })
  ).resolves.not.toThrow();
});

test('Should not login with bad credentials', async () => {
  const login = gql`
    mutation {
      login(
        data: {
          email: "not@test.com",
          password: "4fj49d3"
        }
      ) {
        token
      }
  }`;

  await expect(
    client.mutate({ mutation: login })
  ).rejects.toThrow();
});

test('Should not signup with short password', async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Pink",
          email: "pepa@example.com",
          password: "123"
        }
      ) {
        token
      }
    }
  `

  await expect(
    client.mutate({ mutation: createUser })
  ).rejects.toThrow();
});