const   Comment = {
  author(parent, args, {db}, info) {
    return db.users.find((item) => item.id === parent.author);
  },
  post(parent, args, {db}, info) {
    return db.posts.find((item) => parent.post === item.id);
  }
};

export {Comment as default};
