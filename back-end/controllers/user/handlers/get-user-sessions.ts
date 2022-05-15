import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserLoginDto } from '@libs/user/dto';

import User from '@database/models/user';
import Role from '@database/models/role';
import UserLoginHistory from '@database/models/user-login-history';

const handleGetUserSessions = async (request: Request, response: Response) => {
  const userSessions = await UserLoginHistory.findAll();

  response.json(userSessions);
};

export default handleGetUserSessions;
