import { Request, Response } from 'express';
import User from '@database/models/user';
import { sendActivateEmail } from '../utils';

const handleSendActivateLink = async (request: Request, response: Response) => {
  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
  const user = await User.findOne({ where: { emailAddress: request.headers.emailAddress } });

  if (user != null) await sendActivateEmail(user);

  response.status(204).json(); //No Content
};

export default handleSendActivateLink;
