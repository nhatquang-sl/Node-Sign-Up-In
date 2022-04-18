import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.headers.emailAddress = decoded.emailAddress;
    next();
  });
};

export default verifyJWT;
