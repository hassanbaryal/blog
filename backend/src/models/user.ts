import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, max: 20, required: true },
  password: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now(), required: true },
  admin: { type: Boolean, default: false, required: true },
});

export default mongoose.model('User', userSchema);
