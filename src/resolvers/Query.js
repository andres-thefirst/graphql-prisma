const Query = {
  // parent, args, context, info
  users(parent, args, {prisma}, info) {
    const {query} = args;
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [{
          name_contains: query
        }, {
          email_contains: query
        }]
      }
    }

    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, {prisma}, info) {
    const {query} = args;
    const opArgs = {};

    if (query &&  typeof query === "string") {
      opArgs.where = {
        OR: [
          {
            title_contains: query
          },
          {
            body_contains: query
          }
        ]
      }
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
    const {query} = args;
    const opArgs = {};

    if (query) {
      opArgs.where = {
        text_contains: query
      };
    }

    return prisma.query.comments(opArgs, info);
  },
  me() {
    return {
      id: '123090A',
      name: 'Mike',
      email: 'mike@example.com'
    };
  },
  post() {
    return {
      id: '1d33ed3',
      title: 'The return of the king',
      body: 'This  a post from the king',
      published: 'Today'
    }
  }
};

export  { Query as default};