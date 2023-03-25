import mongoose from "mongoose";

interface RecordAttrs {
  title: string;
  price: number;
}

export interface RecordDoc extends mongoose.Document {
  title: string;
  price: number;
}

interface RecordModel extends mongoose.Model<RecordDoc> {
  build(attrs: RecordAttrs): RecordDoc;
}

const recordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

recordSchema.statics.build = (attrs: RecordAttrs) => {
  return new Record(attrs);
}

const Record = mongoose.model<RecordDoc, RecordModel>('Record', recordSchema);

export { Record };