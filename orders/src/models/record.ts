import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface RecordAttrs {
  id: string;
  title: string;
  price: number;
}

export interface RecordDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface RecordModel extends mongoose.Model<RecordDoc> {
  build(attrs: RecordAttrs): RecordDoc;
  findByEvent(event: { id: string, version: number }): Promise<RecordDoc | null>;
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
recordSchema.set('versionKey', 'version');
recordSchema.plugin(updateIfCurrentPlugin);

recordSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Record.findOne({
    _id: event.id,
    version: event.version - 1
  });
};

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
