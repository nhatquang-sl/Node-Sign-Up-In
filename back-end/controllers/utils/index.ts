import { Request } from 'express';

export const getAccessToken = (request: Request) => {
  const authHeader = (request.headers.authorization || request.headers.Authorization) as string;
  if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return '';
};
