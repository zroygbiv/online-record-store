import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@zroygbiv-ors/sharedcode';
import { body } from 'express-validator';
import { Record } from '../models/record';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const TIME_EXPIRATION_WINDOW = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('recordId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Record ID must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { recordId } = req.body;

    // find record user is trying to order in database
    const record = await Record.findById(recordId);
    if (!record) {
      throw new NotFoundError();
    }

    // check that record is not already reserved
    const isReserved = await record.isReserved();
    if (isReserved) {
      throw new BadRequestError('Record is already reserved');
    }

    // calculate expiration date for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + TIME_EXPIRATION_WINDOW);

    // build order and save to database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      record,
    });
    await order.save();

    // publish an event saying that an order was created
    const publisher = new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      record: {
        id: record.id,
        price: record.price
      }
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
