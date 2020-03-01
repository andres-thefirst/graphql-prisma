import  bcryptjs from 'bcryptjs';

import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, {prisma}, info) {
  const {data} = args;
  const password = await hashPassword(data.password);
  const user = await prisma.mutation.createUser({ 
      data: {
        ...data,
        password
      }
    });

    return {
      token: generateToken(user.id),
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
  async updateUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {data} = args;

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }

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

    if (!postExists) {
      throw new Error('Unable to update post');
    }

    const isPublished = await prisma.exists.Post({id: id, published: true});

    if (!isPublished && published === false) {
      await prisma.mutation.deleteManyComments({post: id});
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
  async createComment(parent, args, {prisma, request }, info) {
    const userId = getUserId(request);
    const {text, post} = args.data;
    const postExists = await prisma.exists.Post({
      id: post,
      published: true
    });

    if (!postExists) {
      throw new Error("Unable to find post");
    }

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
  async deleteComment(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {id} = args;
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if(!commentExists) {
      throw new Error('Unable to delete comment');
    }

    return prisma.mutation.deleteComment({
      where: {
        id
      }
    }, info);
  },
  async updateComment(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {id, data} = args;
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if(!commentExists) {
      throw new Error('Unable to update comment');
    }

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
      token: generateToken(user.id),
      user
    }
  }
}

export {Mutation as default};