import jwt from 'jsonwebtoken';
import ENV from '@config';
import { User } from '@database';

export const generateJwt = (user: User, type: string) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      emailConfirmed: user.emailConfirmed,
      roles: user?.roles?.map((r) => r.code),
      type,
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' } // 30s
  );
  const refreshToken = jwt.sign(
    {
      emailAddress: user.emailAddress,
    },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  return { accessToken, refreshToken };
};
