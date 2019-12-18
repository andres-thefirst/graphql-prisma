import uuidv4 from 'uuid/v4';

const Mutation = {
  createUser(parent, args, {db}, info) {
    const {name, email, age} = args.data;
    const emailTaken = db.users.some((user) => user.email === email);
    if (emailTaken) {
      throw new Error('Email taken.');
    }
    const user = {id: uuidv4(), name, email, age};
    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, {db}, info) {
    const userIndex = db.users.findIndex((item) => item.id === args.id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }
    const deletedUser = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter((comment) => comment.author !== args.id);

    return deletedUser[0];
  },
  updateUser(parent, args, {db}, info) {
  const { id, data} =  args;
  const user = db.users.find(user => user.id === args.id);

  if (!user) {
    throw new Error('User not found');
  }

  if (typeof data.email === 'string'){
    const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email Taken');
      }

      user.email = data.email;
    }

  if (typeof data.name === 'string') {
    user.name = data.name;
  }

  if(typeof data.age !== 'undefined') {
    user.age = data.age;
  }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const {author, published} =  args.data;
    const userExists = db.users.some((item) => item.id === author);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.data
    };

    db.posts.push(post);

    if (published === true) {
      pubsub.publish(`post`, { 
        post: {
          mutation: 'CREATED',
          data: post
        } 
      });
    }

    return post;
  },
  updatePost(parent, args, {db, pubsub}, info) {
      const { id, data: {title, body, published} } = args;

      const post = db.posts.find(post => post.id === id);
      const originalPost = {...post};

      if (!post) {
        throw new Error("Error not found");
      }

      if (typeof title === 'string') {
        post.title = title;
      }

      if(typeof body === 'string') {
        post.body = body;
      }

      if(typeof published === 'boolean' ) {
        post.published = published;

        if (originalPost.published && !post.published) {
          // deleted
          pubsub.publish('post', {
            post: {
              mutation: 'DELETED',
              data: originalPost
            }
          });
        }  else if (!originalPost.published && post.published) {
          // created
          pubsub.publish('post', {
            post: {
              mutation: 'CREATED',
              data: post
            }
          });
        }
      } else if (post.published) {
        //updated
        pubsub.publish('post', {
          post: {
            mutation: 'UPDATED',
            data: post
          }
        });
      }

      console.log('post', post);
      return post;
  }, 
  deletePost(parent, args, {db, pubsub}, info) {
    const postIndex = db.posts.findIndex((item) => item.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter((comment) => comment.post !== post.id);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const {author, post} =  args.data;
    const userExists = db.users.some((item) => item.id === author);
    const postExists = db.posts.some((item) => item.id === post && item.published === true);

    if (!userExists || !postExists) {
      throw new Error('Unable to find User or Post');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }

    db.comments.push(comment);
    pubsub.publish(`comment ${post}`, { comment: {
      mutation: 'CREATED',
      data: comment
    }});

    return comment;
  },
  deleteComment(parent, args, {db, pubsub}, info) {
    const commentIndex = db.comments.findIndex((item) => item.id === args.id);

    if (commentIndex === -1) {
      throw new Error("Post not found");
    }

    const deletedComment = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment[0].post}`, { comment: {
      mutation: 'DELETED',
      data: deletedComment[0]
    }});

    return deletedComment[0];
  },
  updateComment(parent, args, {db, pubsub}, info) {
    const { id, data: { text} } = args;
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof text === 'string') {
      comment.text = text;
    }

    pubsub.publish(`comment ${comment.post}`, { comment: {
      mutation: 'UPDATED',
      data: comment
    }});

    return comment;
  }
}

export {Mutation as default};