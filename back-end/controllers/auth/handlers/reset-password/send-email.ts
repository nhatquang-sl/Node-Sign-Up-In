import jwt from 'jsonwebtoken';
import ENV from '@config';
import { User, UserForgotPassword } from '@database';
import { NotFoundError, BadRequestError } from '@controllers/exceptions';
import { validateEmailAddress } from '@libs/user/validate';
import { sendResetPasswordEmail } from '../../utils';
import { Op } from 'sequelize';

const handleSendEmail = async (
  emailAddress: string,
  ipAddress: string | null = null,
  userAgent: string | null = null
) => {
  const user = await User.findOne({
    where: { emailAddress },
    attributes: ['id', 'emailAddress', 'emailConfirmed'],
  });

  validate(emailAddress, user);
  const userId = user?.id ?? -1;
  let ufp = await UserForgotPassword.findOne({
    where: { userId, password: { [Op.is]: null } },
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
    { expiresIn: '1h' } // 30s
  );

  await sendResetPasswordEmail(emailAddress, resetPasswordToken);
  ufp = await UserForgotPassword.create({
    userId: userId,
    token: resetPasswordToken,
    ipAddress,
    userAgent,
  });

  return { lastDate: new Date(ufp.createdAt).getTime() };
};

const validate = (emailAddress: string, user: User | null) => {
  const emailAddressError = validateEmailAddress(emailAddress);
  if (emailAddressError != undefined) throw new BadRequestError(emailAddressError);
  if (user === null) throw new NotFoundError(`${emailAddress} not found!`);
  if (!user.emailConfirmed) throw new BadRequestError(`${emailAddress} not confirm!`);
};
export default handleSendEmail;
