import  bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import getUserId from '../utils/getUserId';

const Mutation = {
  async createUser(parent, args, {prisma}, info) {
    const {data} = args;

    if (data.password.length < 8) {
      throw new Error('Password must be 8 characters or longer.');
    }

  const password = await bcryptjs.hash(data.password, 10);
  const user = await prisma.mutation.createUser({ 
      data: {
        ...data,
        password
      }
    });

    return {
      token: jwt.sign({ userId: user.id}, 'thisisasecret'),
      user
    }
  },
  async deleteUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser( {
      where: {
        id: userId
      }
    }, info);
  },
  updateUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {data} = args;
    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data
    }, info);
  },
  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const {data} = args;
    return prisma.mutation.createPost({data: {...data, author: {connect: {id: userId}}}}, info);
  },
  async updatePost(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const { id, data: {title, body, published} } = args;

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if(!postExists) {
      throw new Error('Unable to update post');
    }

    return prisma.mutation.updatePost({
      where: {
        id
      }, 
      data: {
        title, body, published
      }
    }, info);
  }, 
  async deletePost(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {id} = args;
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if(!postExists) {
      throw new Error('Unable to delete post');
    }


    return prisma.mutation.deletePost({
      where: {
        id: id
      }
    }, info);
  },
  createComment(parent, args, {prisma, request }, info) {
    const userId = getUserId(request);
    const {text, post} = args.data;
    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          connect: {
            id: userId
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
  },
  async login(parent, args, {prisma}, info) {
    const {data} = args;
    const user = await prisma.query.user({where:{ email: data.email }});
    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcryptjs.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    }

    return {
      token: jwt.sign({ userId: user.id}, 'thisisasecret'),
      user
    }
  }
}

export {Mutation as default};