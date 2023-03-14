import mongoose, { ObjectId } from 'mongoose';
import { DateTime } from 'luxon';
const { Schema } = mongoose;

export interface IComment {
  text: string;
  timeStamp: Date;
  user: ObjectId;
  post: ObjectId;
  likes: ObjectId[];
}

const commentSchema = new Schema<IComment>({
  text: { type: String, max: 1000, required: true },
  timeStamp: { type: Date, default: Date.now(), required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

commentSchema.virtual('formattedTimeStamp').get(function () {
  return DateTime.fromJSDate(this.timeStamp).toLocaleString(
    DateTime.DATETIME_MED
  );
});

export default mongoose.model<IComment>('Comment', commentSchema);
