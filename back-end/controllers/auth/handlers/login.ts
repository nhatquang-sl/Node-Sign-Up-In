import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserLoginDto } from '@libs/user/dto';

import User from '@database/models/user';
import Role from '@database/models/role';

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

  // Evaluate password
  const match = await bcrypt.compare(req.password, foundUser.password);
  if (!match) return response.status(401).json({ message: 'Username or password invalid.' }); // Unauthorized

  // Create JWTs
  const accessToken = jwt.sign(
    {
      emailAddress: foundUser.emailAddress,
      emailConfirmed: foundUser.emailConfirmed,
      roles: foundUser?.roles?.map((r) => r.code),
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '30s' }
  );
  const refreshToken = jwt.sign(
    {
      emailAddress: foundUser.emailAddress,
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
    maxAge: 24 * 60 * 60 * 1000,
  });

  response.json({
    ...User.getAuthDto(foundUser, accessToken),
  });
};
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const copy = {} as Pick<T, K>;

  keys.forEach((key) => (copy[key] = obj[key]));

  return copy;
}
export default handleLogin;
