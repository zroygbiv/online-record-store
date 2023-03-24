import express, { Request, Response } from 'express';

import { Record } from '../models/record';
import { NotFoundError } from '@zroygbiv-ors/sharedcode';

const router = express.Router();

router.get('/api/records/:id', async (req: Request, res: Response) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    throw new NotFoundError
  }

  res.send(record);
});

export { router as showRecordRouter };