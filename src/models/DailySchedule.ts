import mongoose, { Schema } from "mongoose";

const DailyScheduleSchema = new Schema({
  userID: { type: String, required: true },
  date: { type: String, required: true },
  subtasks: [
    {
      taskID: String,
      taskname: String,
      deadline: Date,
      subtaskID: String,
      subtaskname: String,
      subtaskdescription: String,
      subtaskduration: Number,
      subtaskstatus: String,
    },
  ],
});

export default mongoose.models.DailySchedule ||
  mongoose.model("DailySchedule", DailyScheduleSchema);
