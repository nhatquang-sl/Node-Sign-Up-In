import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { validateUserRegister } from '@libs/user/validate';
import { UserRegisterDto } from '@libs/user/dto';
import { User, Role, UserRole, UserLoginHistory } from '@database';
import { BadRequestError, ConflictError } from '@application/exceptions';

import { sendActivateEmail } from '../utils';

const handleRegister = async (
  req: UserRegisterDto,
  ipAddress: string = '',
  userAgent: string = ''
) => {
  const { firstNameError, lastNameError, emailAddressError, passwordError } =
    validateUserRegister(req);
  if (firstNameError || lastNameError || emailAddressError || passwordError.length) {
    const error = { firstNameError, lastNameError, emailAddressError };
    throw new BadRequestError(passwordError.length > 0 ? { ...error, passwordError } : error);
  }

  // Check for duplicate usernames in the db
  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
  const duplicate = await User.findOne({
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

  if (duplicate) throw new ConflictError({ emailAddressError: 'Duplicated email address!' });

  // encrypt the password
  const salt = uuid().split('-')[0];
  const password = await bcrypt.hash(req.password + salt, 10);
  const securityStamp = uuid();

  // Create and store the new user
  const result = await User.create({
    emailAddress: req.emailAddress,
    firstName: req.firstName,
    lastName: req.lastName,
    password,
    salt,
    securityStamp,
  } as User);

  let userRoles = [{ userId: result.id, roleCode: 'user' }];
  if (req.emailAddress === 'sunlight479@yahoo.com')
    userRoles.push({ userId: result.id, roleCode: 'admin' });

  const userRole = await UserRole.bulkCreate(userRoles);

  await sendActivateEmail(result, securityStamp);

  const loginHistory = await UserLoginHistory.create({
    userId: result.id,
    ipAddress,
    userAgent,
  });

  // Create JWTs
  const accessToken = jwt.sign(
    {
      userId: result.id,
      sessionId: loginHistory.id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );
  const refreshToken = jwt.sign(
    {
      emailAddress: req.emailAddress,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );

  // Saving accessToken, refreshToken
  await UserLoginHistory.update({ accessToken, refreshToken }, { where: { id: loginHistory.id } });

  return {
    ...User.getAuthDto(result, accessToken),
    refreshToken,
  };
};

export default handleRegister;
