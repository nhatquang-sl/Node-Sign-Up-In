import { Request, Response } from 'express';

import User from '@database/models/user';

const handleRegisterConfirm = async (request: Request, response: Response) => {
  const { emailActiveCode } = request.params;
  const { id, securityStamp, timestamp } = JSON.parse(
    Buffer.from(emailActiveCode, 'base64').toString('ascii')
  );

  // get user by id
  let user = await User.findOne({ where: { id: id } });

  // validate token
  if (user == null) return response.status(400).json({ errors: ['Your account is not found!'] });
  const confirmTokenErrors = validate(user, securityStamp, timestamp);
  if (confirmTokenErrors.length) return response.status(400).json({ errors: confirmTokenErrors });

  // update email confirmed property
  await User.update({ emailConfirmed: true }, { where: { id: id } });
  // return response
  //   .writeHead(301, {
  //     Location: `http://localhost:3000/login`,
  //   })
  //   .end();
  return response.sendStatus(204);
};

const validate = (user: User, securityStamp: string, timestamp: number) => {
  const TIME_TO_LIVE = 1000 * 60 * 5;

  if (user.securityStamp != securityStamp) return ['Your confirm token is invalid!'];

  if (new Date().getTime() - timestamp > TIME_TO_LIVE) return ['Your confirm token is expired!'];

  return [];
};

export default handleRegisterConfirm;
