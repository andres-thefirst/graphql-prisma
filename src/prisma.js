import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

// prisma.query prisma.mutation prisma.subscription  prisma.extis

const createPostForUser = async (authorId, data) => {
  const posts = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ id }');
  const user = await prisma.query.user({
    where: {
      id: authorId
    }
  }, '{ id name email posts { id title published } }')
  return user;
}

// createPostForUser('ck3zh1nys00fk0852zdty556s', {
//   title: 'Great life to live', 
//   body: "The body part",
//   published: true
// }).then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch(e => {
//   console.log(e);
// });

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost({
    data: data, 
    where: {
      id: postId
    }
  }, ' { author { id } } ');
  console.log(post);
  const user = await prisma.query.user({
    where: {
      id: post.author.id
    }
  }, '{ id name email posts { id title body published } }');
  return user;
};

// updatePostForUser('ck4xqa8ed000i0852shog96da', {
//   title: "a title",
//   body: 'a body updated',
//   published: false
// }).then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch(e => {
//   console.log(e);
// });
