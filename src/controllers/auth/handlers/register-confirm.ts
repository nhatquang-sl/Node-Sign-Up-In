import { Request, Response } from 'express';

import User from '../../../database/models/user';

const handleRegisterConfirm = async (req: Request, res: Response) => {
  const { emailActiveCode } = req.params;
  const { id, securityStamp, timestamp } = JSON.parse(
    Buffer.from(emailActiveCode, 'base64').toString('ascii')
  );

  // get user by id
  let user = await User.findOne({ where: { id: id } });

  // validate token
  if (user == null) return res.status(400).json({ errors: ['Your account is not found!'] });
  const confirmTokenErrors = validate(user, securityStamp, timestamp);
  if (confirmTokenErrors.length) return res.status(400).json({ errors: confirmTokenErrors });

  // update email confirmed property
  User.update({ emailConfirmed: true }, { where: { id: id } });

  res.status(201).json({ message: `Account Email Address Confirmation Success` });
};

const validate = (user: User, securityStamp: string, timestamp: number) => {
  const TIME_TO_LIVE = 1000 * 60 * 5;

  if (user.getDataValue('securityStamp') != securityStamp)
    return ['Your confirm token is invalid!'];

  if (new Date().getTime() - timestamp > TIME_TO_LIVE) return ['Your confirm token is expired!'];

  return [];
};

export default handleRegisterConfirm;
