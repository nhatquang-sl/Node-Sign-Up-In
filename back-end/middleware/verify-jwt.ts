import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ENV from '@config';
import UserActivity from '@database/models/user-activity';

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
  console.log(req.sessionId);
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
    console.log({ err, decoded });
    if (err) return res.sendStatus(401); // Invalid token
    console.log({
      sessionId: decoded.sessionId,
      method: req.method,
      originalUrl: req.originalUrl,
      req,
    });
    req.headers.userId = decoded.userId;
    const start = new Date().getTime();

    // execute action
    next();

    const end = new Date().getTime() - start;
    await UserActivity.create({
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      method: req.method,
      path: req.originalUrl,
      processed: end,
    });
  });
};

export default verifyJWT;
