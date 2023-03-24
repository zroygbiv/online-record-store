import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@zroygbiv-ors/sharedcode';
import { Record } from '../models/record';

const router = express.Router();

router.post('/api/records', 
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0}).withMessage('Price must be greater than 0')
  ],
  validateRequest, 
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const record = Record.build({
      title,
      price,
      userId: req.currentUser!.id
    });
    await record.save();

    res.status(201).send(record);
});

export { router as createRecordRouter }