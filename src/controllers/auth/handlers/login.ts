import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../../database/models/user';

type LoginRequest = {
  emailAddress: string;
  password: string;
};

const handleLogin = async (request: Request, response: Response) => {
  const req: LoginRequest = request.body;
  if (!req.emailAddress || !req.password)
    return response.status(400).json({ message: 'Username and password are required.' });
  const foundUser = await User.findOne({ where: { emailAddress: req.emailAddress } });
  if (!foundUser) return response.sendStatus(401); // Unauthorized

  // Evaluate password
  const match = await bcrypt.compare(req.password, foundUser.password);
  if (!match) return response.sendStatus(401);

  // Create JWTs
  const accessToken = jwt.sign(
    { emailAddress: foundUser.emailAddress, emailConfirmed: foundUser.emailConfirmed },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '30s' }
  );
  const refreshToken = jwt.sign(
    {
      emailAddress: foundUser.emailAddress
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );

  // Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  await User.update({ refreshToken }, { where: { id: foundUser.id } });

  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000
  });
  response.json({ accessToken });
};

export default handleLogin;
