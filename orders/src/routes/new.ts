import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, BadRequestError, OrderStatus } from '@zroygbiv-ors/sharedcode';
import { body } from 'express-validator';
import { Record } from '../models/record';
import { Order } from '../models/order';

const router = express.Router(); 

const EXPIRATION_TIME_WINDOW = 15 * 60;

router.post('/api/orders', 
  requireAuth,
  [
    body('recordId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Record ID must be provided')
  ],  
  validateRequest,
  async (req: Request, res: Response) => {
    const { recordId } = req.body;

    // find ticket user is attempting to order in database
    const record = await Record.findById(recordId);
    if (!record) {
      throw new NotFoundError();
    }

    // make sure ticket isn't already reserved; run query to look at all orders
    // find order where record is the record just found and the orders status is
    // not cancelled; if order found, then ticket is already reserved
    const isReserved = await record.isReserved();
    if (isReserved) {
      throw new BadRequestError('Record is already reserved');
    }

    // calculate time of order expiration 
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_TIME_WINDOW);

    // build order and save to database 
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      record
    });
    await order.save();

    // publish event informing other services order was created
    
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };