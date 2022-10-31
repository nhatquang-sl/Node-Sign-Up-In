import jwt from 'jsonwebtoken';
import ENV from '@config';
import { User } from '@database';

export type TokenData = {
  userId: number;
  roles: string[];
  type: string;
};

export const generateTokens = (user: TokenData) => {
  const accessToken = jwt.sign(user, ENV.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign(user, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

  return { accessToken, refreshToken };
};

export const decodeAccessToken = async (accessToken: string) => {
  return new Promise<TokenData>((resolve, reject) =>
    jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) reject(err);
      resolve({
        userId: decoded.userId,
        roles: decoded.roles,
        type: decoded.type,
      } as TokenData);
    })
  );
};

export const decodeRefreshToken = async (refreshToken: string) => {
  return new Promise<TokenData>((resolve, reject) =>
    jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) reject(err);
      resolve({
        userId: decoded.userId,
        roles: decoded.roles,
        type: decoded.type,
      } as TokenData);
    })
  );
};
