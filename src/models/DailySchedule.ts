// models/DailySchedule.ts
import mongoose, { Schema } from "mongoose";

const DailyScheduleSchema = new Schema({
  userID: { type: String, required: true },
  date: { type: String, required: true }, // e.g., '2025-06-25'
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
