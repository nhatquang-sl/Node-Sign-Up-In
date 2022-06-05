import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import ENV from '@config';
import { User, UserForgotPassword } from '@database';
import { validatePassword } from '@libs/user/validate';

import { UnauthorizedError, BadRequestError } from '@controllers/exceptions';

const handleSetNew = async (token: string, newPassword: string) => {
  const passwordError = validatePassword(newPassword);
  if (passwordError.length) throw new BadRequestError(passwordError[0]);

  await jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
    // console.log({ err, decoded });
    if (err) throw new UnauthorizedError();

    const userId = decoded.userId as number;
    const password = await bcrypt.hash(newPassword, 10);
    await Promise.all([
      UserForgotPassword.update(
        { password },
        { where: { userId, token, password: { [Op.is]: null } } }
      ),
      User.update({ password }, { where: { id: userId } }),
    ]);
  });
  return { lastDate: new Date().getTime() };
};

export default handleSetNew;
