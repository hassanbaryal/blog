import mongoose from 'mongoose';
import { DateTime } from 'luxon';

export interface IUser {
  username: string;
  password: string;
  timeStamp: Date;
  admin: boolean;
}

const { Schema } = mongoose;

const userSchema = new Schema<IUser>({
  username: { type: String, max: 20, required: true },
  password: { type: String, required: true },
  timeStamp: { type: Date, default: Date.now(), required: true },
  admin: { type: Boolean, default: false, required: true },
});

userSchema.virtual('formattedTimeStamp').get(function () {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

export default mongoose.model<IUser>('User', userSchema);
