import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserLoginDto } from '@libs/user/dto';

import { User, Role, UserLoginHistory } from '@database';
import { BadRequestError, UnauthorizedError } from '@application/exceptions';

const handleLogin = async (req: UserLoginDto, ipAddress: string = '', userAgent: string = '') => {
  // response.header('Access-Control-Request-Private-Network', 'true');
  if (!req.emailAddress || !req.password)
    throw new BadRequestError({ message: 'Username and password are required.' });

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
  if (!foundUser) throw new UnauthorizedError({ message: 'Username or password invalid.' });

  // Evaluate password
  const match = await bcrypt.compare(req.password + foundUser.salt, foundUser.password);
  if (!match) throw new UnauthorizedError({ message: 'Username or password invalid.' });

  const loginHistory = await UserLoginHistory.create({
    userId: foundUser.id,
    ipAddress,
    userAgent,
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

  return {
    ...User.getAuthDto(foundUser, accessToken),
    refreshToken,
  };
};

export default handleLogin;
