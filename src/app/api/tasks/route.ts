import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Task from "@/models/task";
import { callGemini } from "@/lib/gemini";
import getOrCreateUser from "@/lib/getOrCreateUser";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  await dbConnect();
  const user = await getOrCreateUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const taskData = await req.json();

  const prompt = `
You are a smart task planner.

I will give you a task object in this format:
{
  "taskname": "${taskData.taskname}",
  "deadline": "${taskData.deadline}",
  "duration": ${taskData.duration},
  "priority": "${taskData.priority}",
  "description": "${taskData.description}",
  "remainingDuration": ${taskData.duration},
  "workedDuration": 0,
  "status": "pending"
}

Your task:
1. Break this task into logical, manageable subtasks.
2. Each subtask must have:
   - subtaskname
   - subtaskdescription
   - subtaskduration (sum of all subtask durations must equal ${taskData.duration})
   - subtaskstatus = "pending"
   - subtasksID (so i cab track the sequece of subtasks just have 1,2,3,...)
3. Return the response in this JSON format:

the tasks should be in the following format:
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

Return only valid JSON. Do NOT wrap the output in triple backticks or Markdown. Do not include comments or trailing text. Output ONLY the final JSON object.
`;

  // Call Gemini model with taskData
  const geminiResult = await callGemini(prompt);
  if (!geminiResult) {
    return NextResponse.json(
      { error: "Failed to generate subtasks" },
      { status: 500 }
    );
  }

  const data = JSON.parse(geminiResult);

  // Save both taskData and Gemini result in DB
  data.userID = user.clerkId;
  const task = await Task.create(data);
  if (!task) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
  await task.save();

  return NextResponse.json(task, { status: 201 });
}

export async function GET() {
  try {
    await dbConnect();

    const clerkUser = await currentUser();
    if (!clerkUser) {
      redirect("/sign-in");
      throw new Error("Use not Signed-in");
    }

    const tasks = await Task.find({ userID: clerkUser.id });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
