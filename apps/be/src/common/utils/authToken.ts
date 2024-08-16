import { InvalidTokenError } from '@/common/errors';
import { FastifyRequest } from 'fastify';
import jwt, { SignOptions } from 'jsonwebtoken';

const isPlainObject = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const signToken = (payload: object, options?: SignOptions): string =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '180 days',
    ...options,
  });

export const verifyToken = (token: string): { [key: string]: any } => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (isPlainObject(payload)) {
      return payload as { [key: string]: any };
    }
    throw new Error();
  } catch (error) {
    throw new InvalidTokenError();
  }
};

export const getAuthTokenFromRequest = (req: FastifyRequest): string | null => {
  const header = req.headers['authorization'] || '';
  const [bearer, token] = header.split(' ');
  return bearer === 'Bearer' && token ? token : null;
};
