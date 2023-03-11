import mongoose, { ObjectId } from 'mongoose';
import { DateTime } from 'luxon';

const { Schema } = mongoose;

export interface IPost {
  title: string;
  body: string;
  timeStamp: Date;
  user: ObjectId;
  likes: ObjectId[];
  published: boolean;
}

const postSchema = new Schema<IPost>({
  title: { type: String, max: 80, required: true },
  body: { type: String, max: 10000, required: true },
  timeStamp: { type: Date, default: Date.now(), required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  published: { type: Boolean, default: false, required: true },
});

postSchema.virtual('formattedTimeStamp').get(function () {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

export default mongoose.model<IPost>('Post', postSchema);
