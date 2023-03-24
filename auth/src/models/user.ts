import mongoose from "mongoose";
import { PasswordManager } from "../services/password";

// describes required props for creating new User
interface UserAttrs {
  email: string;
  password: string;
}
// describes props User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
// describes props User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// db schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,   //String is specific to mongoose
    required: true
  },
  password: {
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
      delete ret.password;
      delete ret.__v;
    } 
  }
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
