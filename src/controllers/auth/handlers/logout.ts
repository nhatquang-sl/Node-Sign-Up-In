import { Request, Response } from 'express';

const handleLogout = async (req: Request, res: Response) => {
  res.sendStatus(204);
};

export default handleLogout;
