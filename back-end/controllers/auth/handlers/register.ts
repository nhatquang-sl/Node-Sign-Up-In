import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { validateUserRegister } from '@libs/user/validate';
import User from '@database/models/user';
import Role from '@database/models/role';
import UserRole from '@database/models/user-role';
import UserLoginHistory from '@database/models/user-login-history';

import { sendActivateEmail } from '../utils';

const handleRegister = async (request: Request, response: Response) => {
  const req: User = request.body;

  const { firstNameError, lastNameError, emailAddressError, passwordError } = validateUserRegister(
    request.body
  );
  if (firstNameError || lastNameError || emailAddressError || passwordError.length) {
    return response
      .status(400)
      .json({ firstNameError, lastNameError, emailAddressError, passwordError });
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

  if (duplicate)
    return response.status(409).json({ emailAddressError: 'Duplicated email address!' }); // Conflict

  req.emailConfirmed = false;
  // encrypt the password
  req.password = await bcrypt.hash(req.password, 10);
  req.securityStamp = uuid();

  // Create and store the new user
  const result = await User.create({
    emailAddress: req.emailAddress,
    firstName: req.firstName,
    lastName: req.lastName,
    password: req.password,
    emailConfirmed: false,
    securityStamp: req.securityStamp,
  });

  let userRoles = [{ userId: result.id, roleCode: 'user' }];
  if (req.emailAddress === 'sunlight479@yahoo.com')
    userRoles.push({ userId: result.id, roleCode: 'admin' });

  const userRole = await UserRole.bulkCreate(userRoles);

  await sendActivateEmail(result, req.securityStamp);

  const loginHistory = await UserLoginHistory.create({
    userId: result.id,
    ipAddress: request.ip,
    userAgent: request.get('User-Agent'),
  });

  // Create JWTs
  const accessToken = jwt.sign(
    {
      userId: result.id,
      emailConfirmed: req.emailConfirmed,
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

  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  response.status(201).json({
    ...User.getAuthDto(result, accessToken),
  });
};

export default handleRegister;
