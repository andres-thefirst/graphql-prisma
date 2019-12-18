const  Post = {
  author(parent, args, {db}, info) {
    return db.users.find((item) => item.id === parent.author);
  },
  comments(parent, args, {db}, info) {
    return db.comments.filter((item) => item.post === parent.id);
  }
};

export {Post as default};
