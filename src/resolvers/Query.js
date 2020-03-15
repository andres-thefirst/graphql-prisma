import getUserId from '../utils/getUserId';

const Query = {
  // parent, args, context, info
  users(parent, args, {prisma}, info) {
    const {query, first, skip, after, orderBy} = args;
    const opArgs = {
      first,skip, after, orderBy
    };

    if (query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }]
      }
    }

    return prisma.query.users(opArgs, info);
  },
  async myPosts(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);
    const {query, first, skip, after, orderBy} = args;
    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first, skip, after, orderBy
    };

    if (query &&  typeof query === "string") {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, {prisma}, info) {
    const {query, first, skip, after, orderBy} = args;
    const opArgs = {
      where: {
        published: true
      },
      first, skip, after, orderBy
    };

    if (query &&  typeof query === "string") {
      opArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }

    return prisma.query.posts(opArgs, info);
    // const {query} = args;
    // if (!query) {
    //   return db.posts;
    // }
    // return db.posts.filter((post) => {
    //   return post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase())
    // }); 
  },
  comments(parent, args, {prisma}, info) {
    const {query,first, skip, after} = args;
    const opArgs = {first, skip, after};

    if (query) {
      opArgs.where = {
        text_contains: query
      };
    }

    return prisma.query.comments(opArgs, info);
  },
  me(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);

    return prisma.query.user({where: {
      id: userId
    }}, info);
  },
  async post(parent, args, {prisma, request}, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info);

    if (posts.length === 0) {
      throw new Error('Post not found');
    }

    return posts[0];
  }
};

export  { Query as default};