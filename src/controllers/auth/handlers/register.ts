import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../../../database/models/user';

type RegisterRequest = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
};

const handleRegister = async (req: Request, res: Response) => {
  const regRequest: RegisterRequest = req.body;

  const errors = validateRequest(regRequest);
  if (errors.length) return res.status(400).json({ errors });

  // Check for duplicate usernames in the db
  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
  const duplicate = await User.findOne({ where: { emailAddress: regRequest.emailAddress } });
  if (duplicate) return res.sendStatus(409); // Conflict

  // encrypt the password
  regRequest.password = await bcrypt.hash(regRequest.password, 10);

  // Create and store the new user
  const result = await User.create(regRequest);

  res.status(201).json({ success: `New user ${regRequest.emailAddress} created!` });
};

const validateRequest = (req: RegisterRequest) => {
  let errors = [];

  if (!req.firstName) errors.push('First Name is required!');

  // Validate Email address
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.emailAddress))
    errors.push('Email Address is invalid!');

  // Validate Password
  if (!/[a-z]/.test(req.password)) errors.push('Password contains at least one lower character');
  if (!/[A-Z]/.test(req.password)) errors.push('Password contains at least one upper character');
  if (!/\d/.test(req.password)) errors.push('Password contains at least one digit character');
  if (req.password?.length < 8) errors.push('Password contains at least one special character');
  if (req.password?.length < 8) errors.push('Password contains at least 8 characters');

  return errors;
};

export default handleRegister;
