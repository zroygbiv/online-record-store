import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface RecordAttrs {
  id: string;
  title: string;
  price: number;
}

export interface RecordDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface RecordModel extends mongoose.Model<RecordDoc> {
  build(attrs: RecordAttrs): RecordDoc;
}

const recordSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

recordSchema.statics.build = (attrs: RecordAttrs) => {
  return new Record({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
};
recordSchema.methods.isReserved = async function () {
  // this === the record document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    record: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Record = mongoose.model<RecordDoc, RecordModel>('Record', recordSchema);

export { Record };
