import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import ENV from '@config';
import { User, UserForgotPassword } from '@database';
import { validatePassword } from '@libs/user/validate';

import { UnauthorizedError, BadRequestError } from '@controllers/exceptions';

const handleSetNew = async (token: string, newPassword: string) => {
  const passwordError = validatePassword(newPassword ?? '');
  if (passwordError.length) throw new BadRequestError({ passwordError });

  await jwt.verify(token, ENV.ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
    // console.log({ err, decoded });
    await validate(err, token);

    const userId = decoded.userId as number;
    const ufp = await UserForgotPassword.findOne({
      where: { userId, token, password: { [Op.is]: null } },
      attributes: ['id', 'salt'],
    });

    const password = await bcrypt.hash(newPassword + ufp?.salt, 10);
    await Promise.all([
      UserForgotPassword.update({ password }, { where: { id: ufp?.id } }),
      User.update({ password, salt: ufp?.salt }, { where: { id: userId } }),
    ]);
  });
  return { lastDate: new Date().getTime() };
};

const validate = async (err: any, token: string) => {
  if (err) throw new UnauthorizedError();
  const ufp = await UserForgotPassword.findOne({
    where: { token, password: { [Op.is]: null } },
    attributes: ['createdAt'],
  });
  if (ufp === null) throw new UnauthorizedError();
};

export default handleSetNew;
