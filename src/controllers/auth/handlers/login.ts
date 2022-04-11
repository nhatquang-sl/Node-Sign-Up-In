import { Request, Response } from 'express';

const handleLogin = async (req: Request, res: Response) => {
  // Evaluate password
  const match = true;
  if (match) {
    res.json({ accessToken: 'accessToken' });
  } else {
    res.sendStatus(401);
  }
};

export default handleLogin;
