import { Request, Response } from 'express';

import User from '@database/models/user';

const handleGetProfile = async (request: Request, response: Response) => {
  const userId = request.headers.userId;

  const user = await User.findOne({
    where: { id: userId },
  });

  if (!user) return response.sendStatus(404);

  response.json({
    ...User.getAuthDto(user, ''),
  });
};

export default handleGetProfile;
