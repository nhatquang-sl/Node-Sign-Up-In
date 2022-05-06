import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { validateUserRegister } from '@libs/user/validate';
import User from '@database/models/user';
import Role from '@database/models/role';
import UserRole from '@database/models/user-role';

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
  console.log(duplicate?.toJSON(), duplicate?.id, duplicate?.firstName);
  if (duplicate)
    return response.status(409).json({ emailAddressError: 'Duplicated email address!' }); // Conflict

  req.emailConfirmed = false;
  // encrypt the password
  req.password = await bcrypt.hash(req.password, 10);
  req.securityStamp = uuid();
  req.refreshToken = jwt.sign(
    {
      emailAddress: req.emailAddress,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );

  // Create and store the new user
  const result = await User.create({
    emailAddress: req.emailAddress,
    firstName: req.firstName,
    lastName: req.lastName,
    password: req.password,
    emailConfirmed: false,
    refreshToken: req.refreshToken,
    securityStamp: req.securityStamp,
  });

  var userRole = await UserRole.bulkCreate([
    // { userId: result.id, roleCode: 'admin' },
    { userId: result.id, roleCode: 'user' },
  ]);
  console.log(userRole);
  await sendActivateEmail(result, req.securityStamp);

  response.cookie('jwt', req.refreshToken, {
    httpOnly: true,
    // sameSite: 'None',
    // secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  // Create JWTs
  const accessToken = jwt.sign(
    { emailAddress: req.emailAddress, emailConfirmed: req.emailConfirmed },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: '1d' }
  );
  response.status(201).json({
    ...User.getAuthDto(result, accessToken),
  });
};

const validateRequest = (req: User) => {
  let errors = [];

  if (!req.firstName) errors.push('First Name is required!');

  // Validate Email address
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.emailAddress))
    errors.push('Email Address is invalid!');

  // Validate Password
  if (!/[a-z]/.test(req.password)) errors.push('Password contains at least one lower character');
  if (!/[A-Z]/.test(req.password)) errors.push('Password contains at least one upper character');
  if (!/\d/.test(req.password)) errors.push('Password contains at least one digit character');
  if (!/[-+_!@#$%^&*.,?]/.test(req.password))
    errors.push('Password contains at least one special character');
  if (req.password?.length < 8) errors.push('Password contains at least 8 characters');

  return errors;
};

export default handleRegister;
