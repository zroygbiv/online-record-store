import express, { Request, Response } from 'express';
import { Record } from '../models/record';

const router = express.Router();

router.get('/api/records', async (req: Request, res: Response) => {
  const records = await Record.find({});

  res.send(records);
});

export { router as indexRecordRouter };