import uuidv4 from 'uuid/v4';

const Mutation = {
  async createUser(parent, args, {prisma}, info) {
    const {data} = args;
    return  prisma.mutation.createUser({ data }, info);
  },
  async deleteUser(parent, args, {prisma}, info) {
    return prisma.mutation.deleteUser( {
      where: {
        id
      }
    }, info);
  },
  updateUser(parent, args, {db, prisma}, info) {
    const {id, data} = args;
    return prisma.mutation.updateUser({
      where: {
        id
      },
      data
    }, info);
  },
  createPost(parent, args, { prisma }, info) {
    const {data} = args;
    return prisma.mutation.createPost({data: {...data, author: {connect: {id: data.author}}}}, info);
    // const {author, published} =  args.data;
    // const userExists = db.users.some((item) => item.id === author);

    // if (!userExists) {
    //   throw new Error('User not found');
    // }

    // const post = {
    //   id: uuidv4(),
    //   ...args.data
    // };

    // db.posts.push(post);

    // if (published === true) {
    //   pubsub.publish(`post`, { 
    //     post: {
    //       mutation: 'CREATED',
    //       data: post
    //     } 
    //   });
    // }

    // return post;
  },
  updatePost(parent, args, {prisma}, info) {
    const { id, data: {title, body, published} } = args;

    return prisma.mutation.updatePost({
      where: {
        id
      }, 
      data: {
        title, body, published
      }
    }, info);
  }, 
  deletePost(parent, args, {prisma}, info) {
    const {id} = args;
    return prisma.mutation.deletePost({
      where: {
        id
      }
    }, info);
  },
  createComment(parent, args, {prisma }, info) {
    const {text, author, post} = args.data;
    console.log(text, author, post);
    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          connect: {
            id: author
          }
        },
        post: {
          connect: {
            id: post
          }
        }
    }
    }, info)
  },
  deleteComment(parent, args, {prisma}, info) {
    const {id} = args;
    return prisma.mutation.deleteComment({
      where: {
        id
      }
    }, info);
  },
  updateComment(parent, args, {prisma}, info) {
    const {id, data} = args;
    return prisma.mutation.updateComment({
      where: {
        id
      },
      data
    }, info);
  }
}

export {Mutation as default};