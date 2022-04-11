import { Request, Response } from 'express';

const handleRegister = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ success: `New user  created!` });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export default handleRegister;
