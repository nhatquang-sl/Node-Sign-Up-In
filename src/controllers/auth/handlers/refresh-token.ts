import { Request, Response } from 'express';

const handleRefreshToken = async (req: Request, res: Response) => {
  res.json({ accessToken: 'new access token' });
};

export default handleRefreshToken;
