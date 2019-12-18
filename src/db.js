// Demo users data
const users = [{
  id: '1',
  name: 'Andres',
  email: 'andres@example.com',
  age: 28
},{
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Michael',
  email: 'mike@example.com'
}];

// Demo posts data
const posts = [{
  id: '1d33ed3',
  title: 'The return of the king',
  body: 'This is about a king that returns',
  published: true,
  author: '1'
},{
  id: 'x3x333',
  title: 'The dark night',
  body: 'Suddently a dark night arrives',
  published: false,
  author: '1'
},{
  id: '54393f345',
  title: 'Avengers end of game',
  body: 'The most beautiful film in the history',
  published: true,
  author: '2'
}];

const comments = [{
  id: '102',
  text: 'My first comment',
  author: '1',
  post: '1d33ed3'
},{
  id: '103',
  text: 'My second comment',
  author: '2',
  post: 'x3x333'
},{
  id: '104',
  text: 'My third comment',
  author: '3',
  post: '54393f345'
},{
  id: '105',
  text: 'My fourth comment',
  author: '1',
  post: '54393f345'
}];


const db = {
  users,
  posts,
  comments
};

export  { db as default };