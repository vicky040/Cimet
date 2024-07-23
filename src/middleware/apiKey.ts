import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';


dotenv.config();

const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['api-key'] as string;
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    next();
  }
};

export default apiKeyMiddleware;

