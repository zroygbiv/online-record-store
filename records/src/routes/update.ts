import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  validateRequest, NotFoundError, requireAuth, NotAuthorizedError 
} from '@zroygbiv-ors/sharedcode';
import { Record } from '../models/record';
import { RecordUpdatedPublisher } from '../events/publishers/record-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/records/:id', 
  requireAuth, 
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0')  
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    throw new NotFoundError();
  }
  if (record.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  record.set({
    title: req.body.title,
    price: req.body.price
  });
  await record.save();
  new RecordUpdatedPublisher(natsWrapper.client).publish({
    id: record.id,
    title: record.title,
    price: record.price,
    userId: record.userId
  });
  
  res.send(record);
});

export { router as updateRecordRouter };