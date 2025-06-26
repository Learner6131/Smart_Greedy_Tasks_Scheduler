import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  userID: { type: String, required: true },
  taskname: { type: String, required: true },
  deadline: { type: Date, required: true },
  duration: { type: Number, required: true },
  priority: { type: String, required: true },
  description: { type: String, required: true },
  remainingDuration: { type: Number, required: true },
  workedDuration: { type: Number, default: 0 },
  status: { type: String, default: "pending" },
  subtasks: [
    {
      subtaskID: { type: String, required: true },
      subtaskname: { type: String, required: true },
      subtaskduration: { type: Number, required: true },
      subtaskstatus: { type: String, default: "pending" },
      subtaskdescription: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
