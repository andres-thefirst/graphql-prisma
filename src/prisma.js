import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});

export { prisma as default }

// prisma.query prisma.mutation prisma.subscription  prisma.exists


// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error('User not found');
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title published } } }');
//   return post.author;
// }

// // createPostForUser('ck3zh1nys00fk0852zdty556s', {
// //   title: 'Great life to live', 
// //   body: "The body part of a single test",
// //   published: true
// // }).then((user) => {
// //   console.log(JSON.stringify(user, undefined, 2));
// // }).catch(e => {
// //   console.log(e.message);
// // });

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw new Error('Post not found');
//   }
//   const post = await prisma.mutation.updatePost({
//     data: data, 
//     where: {
//       id: postId
//     }
//   }, ' { author { id name email posts { id title body published } } } ');
//   console.log(post);
//   return post.author;
// };

// updatePostForUser('ck4xqa8ed000i0852shog96da', {
//   title: "a title",
//   body: 'a body updated from original',
//   published: false
// }).then((user) => {
//   console.log(JSON.stringify(user, undefined, 2));
// }).catch(e => {
//   console.log(e.message);
// });
