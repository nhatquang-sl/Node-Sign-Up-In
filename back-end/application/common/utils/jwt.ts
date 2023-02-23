import jwt from 'jsonwebtoken';
import ENV from '@config';
import { TokenData } from '@libs/user';

export type TokenParam = {
  id: number;
  roles: string[];
  firstName: string;
  lastName: string;
  emailAddress: string;
  type: string;
};

export const generateTokens = (
  user: TokenParam,
  expiresIn: '3s' | '5m' | '15m' | '30m' = '15m'
) => {
  const accessToken = jwt.sign(user, ENV.ACCESS_TOKEN_SECRET, { expiresIn });
  const refreshToken = jwt.sign(user, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

  return { accessToken, refreshToken };
};

export const decodeAccessToken = async (accessToken: string) => {
  return new Promise<TokenData>((resolve, reject) =>
    jwt.verify(accessToken, ENV.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) reject(err);
      resolve(decoded as TokenData);
    })
  );
};

export const decodeRefreshToken = async (refreshToken: string) => {
  return new Promise<TokenData>((resolve, reject) =>
    jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) reject(err);
      resolve(decoded as TokenData);
    })
  );
};
