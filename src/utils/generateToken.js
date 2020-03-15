import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.PRISMA_JWT_SECRET;

const generateToken = (id) => {
  return jwt.sign({ userId: id}, JWT_SECRET, { expiresIn: '7 days' });
};

export { generateToken as default };