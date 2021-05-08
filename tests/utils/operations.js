import { gql }  from 'apollo-boost';

const createUser = gql`
  mutation($data: CreateUserInput!) {
    createUser(
      data: $data
    ) {
      token,
      user {
        id
        name
        email
      }
    }
  }
`;

const getUsers = gql`
  query {
    users {
      id
      name
      email 
    }
  }
`;

const login = gql`
  mutation($data: LoginUserInput!) {
    login(
      data: $data
    ){
      token
    }
  }
`;

const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

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

  const updatePost = gql`
    mutation($id: ID!, $data: UpdatePostInput!) {
      updatePost(
        id: $id,
        data: $data
      ) {
        id
        title
        body
        published
      }
    }
  `;

const createPost = gql`
mutation($data: CreatePostInput!) {
  createPost(
    data: $data
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

const deletePost = gql`
  mutation ($id: ID!) {
    deletePost(
      id: $id
    ) {
      id
      title
      body
      published
    }
  }
`;

const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(
      id: $id
    ) {
      id
      text
    }
  }
`;

const subscribeToComments = gql`
  subscription($postId: ID!) {
    comment(postId: $postId) {
      mutation
      node {
        id
        text
      }
    }
  }
`;

const subscribeToPosts = gql`
  subscription {
    post {
      mutation
      node {
        id
        title
        body
        published
      }
    }
  }
`;

export { createUser, login, getProfile, getUsers, getPosts, myPosts, updatePost, createPost, deletePost, deleteComment, subscribeToComments, subscribeToPosts };