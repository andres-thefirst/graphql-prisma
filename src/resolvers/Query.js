const Query = {
  // parent, args, context, info
  users(parent, args, {db}, info) {
    const {query} = args;
    if (!query) {
      return db.users;
    }
    return db.users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
  },
  posts(parent, args, {db}, info) {
    const {query} = args;
    if (!query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      return post.title.toLowerCase().includes(query.toLowerCase()) || post.body.toLowerCase().includes(query.toLowerCase())
    }); 
  },
  comments(parent, args, {db}, info) {
    return db.comments;
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
