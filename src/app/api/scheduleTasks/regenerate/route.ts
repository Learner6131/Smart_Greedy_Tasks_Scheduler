import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import DailySchedule from "@/models/DailySchedule";
import Task from "@/models/task";
import { currentUser } from "@clerk/nextjs/server";
import { Pending, TaskType, Subtask } from "@/types/types";
type Priority = "high" | "medium" | "low";

const MAX_HOURS = 6;

function sortWeight(task: TaskType) {
  const deadline = new Date(task.deadline).getTime();
  const daysLeft = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
  const priorityMap: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
  const priority = task.priority?.toLowerCase() as Priority;
  return {
    deadline,
    priorityScore: priorityMap[priority] ?? 0,
    daysLeft,
    remaining: task.remainingDuration,
    task,
  };
}

export async function POST() {
  await dbConnect();
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("getting post to regenrate");
  const userID = user.id;
  const today = new Date().toISOString().slice(0, 10);

  const tasks = await Task.find({ userID, status: { $ne: "completed" } });

  const pending: Pending[] = [];
  for (const task of tasks) {
    const weight = sortWeight(task);
    const subtasks = task.subtasks.filter(
      (s: Subtask) => s.subtaskstatus !== "completed"
    );

    for (const sub of subtasks) {
      pending.push({
        taskID: task._id,
        taskname: task.taskname,
        deadline: task.deadline,
        subtaskID: sub.subtaskID,
        subtaskname: sub.subtaskname,
        subtaskdescription: sub.subtaskdescription,
        subtaskduration: sub.subtaskduration,
        subtaskstatus: sub.subtaskstatus,
        weight,
      });
    }
  }

  pending.sort((a, b) => {
    if (a.weight.deadline !== b.weight.deadline)
      return a.weight.deadline - b.weight.deadline;
    if (a.weight.priorityScore !== b.weight.priorityScore)
      return b.weight.priorityScore - a.weight.priorityScore;
    if (a.weight.daysLeft > 3) return b.subtaskduration - a.subtaskduration;
    return a.subtaskduration - b.subtaskduration;
  });

  const todayPlan: Pending[] = [];
  let used = 0;
  for (const item of pending) {
    if (used + item.subtaskduration <= MAX_HOURS) {
      todayPlan.push(item);
      used += item.subtaskduration;
    }
    if (used >= MAX_HOURS) break;
  }

  await DailySchedule.findOneAndUpdate(
    { userID, date: today },
    { userID, date: today, subtasks: todayPlan },
    { upsert: true }
  );

  return NextResponse.json({
    message: "Daily schedule regenerated",
    todayPlan,
  });
}
