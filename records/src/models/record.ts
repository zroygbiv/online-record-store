import mongoose from "mongoose";

// describes required props for creating new Record
interface RecordAttrs {
  title: string;
  price: number;
  userId: string;
}
// describes props Record Document has
interface RecordDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}
// describes props Record Model has
interface RecordModel extends mongoose.Model<RecordDoc> {
  build(attrs: RecordAttrs): RecordDoc;
}

// db schema
const recordSchema = new mongoose.Schema({
  title: {
    type: String,   // String specific to mongoose
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }  
}, {
  // customize how object gets converted to JSON
  toJSON: {
    // view level logic
    // doc - mongoose doc being converted 
    // ret - plain obj representation which has been used
    transform(doc, ret) {
      // remap id name prop changing mongoose default '_id' to 'id'
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

recordSchema.statics.build = (attrs: RecordAttrs) => {
  return new Record(attrs);
};

const Record = mongoose.model<RecordDoc, RecordModel>('Record', recordSchema);

export { Record };