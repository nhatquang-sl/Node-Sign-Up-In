import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserLoginDto } from '@libs/user/dto';

import User from '@database/models/user';
import Role from '@database/models/role';
import UserLoginHistory from '@database/models/user-login-history';

const handleLogin = async (request: Request, response: Response) => {
  const req: UserLoginDto = request.body;
  response.header('Access-Control-Request-Private-Network', 'true');
  if (!req.emailAddress || !req.password)
    return response.status(400).json({ message: 'Username and password are required.' });
  const foundUser = await User.findOne({
    where: { emailAddress: req.emailAddress },
    include: [
      {
        model: Role,
        attributes: ['code'],
        through: {
          attributes: [],
        },
      },
    ],
  });
  console.log({ roles: foundUser?.roles?.map((r) => r.code) });
  if (!foundUser) return response.status(401).json({ message: 'Username or password invalid.' }); // Unauthorized
  console.log(foundUser);
  // Evaluate password
  const match = await bcrypt.compare(req.password, foundUser.password);
  if (!match) return response.status(401).json({ message: 'Username or password invalid.' }); // Unauthorized

  const loginHistory = await UserLoginHistory.create({
    userId: foundUser.id,
    ipAddress: request.ip,
    userAgent: request.get('User-Agent'),
  });

  // Create JWTs
  const accessToken = jwt.sign(
    {
      userId: foundUser.id,
      emailConfirmed: foundUser.emailConfirmed,
      sessionId: loginHistory.id,
      roles: foundUser?.roles?.map((r) => r.code),
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1d' } // 30s
  );
  const refreshToken = jwt.sign(
    {
      emailAddress: foundUser.emailAddress,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );

  // Saving accessToken, refreshToken
  await UserLoginHistory.update({ accessToken, refreshToken }, { where: { id: loginHistory.id } });

  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  response.json({
    ...User.getAuthDto(foundUser, accessToken),
  });
};

export default handleLogin;
