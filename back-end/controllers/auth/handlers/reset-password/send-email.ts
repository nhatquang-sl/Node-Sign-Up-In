import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import ENV from '@config';
import { TIMESTAMP } from '@libs/constant';
import { User, UserForgotPassword } from '@database';
import { NotFoundError, BadRequestError } from '@application/common/exceptions';
import { validateEmailAddress } from '@libs/user/validate';
import { sendResetPasswordEmail } from '../../utils';
import { Op } from 'sequelize';

const handleSendEmail = async (
  emailAddress: string,
  ipAddress: string | null = null,
  userAgent: string | null = null
) => {
  validateEmail(emailAddress);
  const user = await User.findOne({
    where: { emailAddress },
    attributes: ['id', 'emailAddress', 'emailConfirmed'],
  });
  validate(emailAddress, user);

  const userId = user?.id ?? -1;
  let ufp = await UserForgotPassword.findOne({
    where: {
      userId,
      password: { [Op.is]: null },
      createdAt: {
        [Op.gt]: new Date(new Date().getTime() - 5 * TIMESTAMP.MINUTE),
      },
    },
    attributes: ['createdAt'],
  });
  if (ufp != null) return { lastDate: new Date(ufp.createdAt).getTime() };

  // Create JWT token
  const resetPasswordToken = jwt.sign(
    {
      userId,
      resetPassword: true,
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' } // one hour
  );

  await sendResetPasswordEmail(emailAddress, resetPasswordToken);
  ufp = await UserForgotPassword.create({
    userId: userId,
    token: resetPasswordToken,
    ipAddress,
    userAgent,
    salt: uuid().split('-')[0],
  });

  return { lastDate: new Date(ufp.createdAt).getTime() };
};

const validateEmail = (emailAddress: string) => {
  const emailAddressError = validateEmailAddress(emailAddress);
  if (emailAddressError != undefined) throw new BadRequestError(emailAddressError);
};
const validate = (emailAddress: string, user: User | null) => {
  if (user === null) throw new NotFoundError(`${emailAddress} not found!`);
  if (!user.emailConfirmed) throw new BadRequestError(`${emailAddress} not confirm!`);
};
export default handleSendEmail;
