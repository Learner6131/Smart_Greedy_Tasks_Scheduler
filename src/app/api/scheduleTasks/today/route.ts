// import dbConnect from "@/lib/dbConnect";
// import Task from "@/models/task";
// import DailySchedule from "@/models/DailySchedule";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const MAX_HOURS = 6;

// function sortWeight(task: any) {
//   const deadline = new Date(task.deadline).getTime();
//   const daysLeft = Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24));
//   const priorityMap = { high: 3, medium: 2, low: 1 };
//   return {
//     deadline,
//     priorityScore: priorityMap[task.priority?.toLowerCase()] || 0,
//     daysLeft,
//     remaining: task.remainingDuration,
//     task,
//   };
// }

// export async function GET() {
//   await dbConnect();
//   const clerkUser = await currentUser();
//   const userID = clerkUser?.id;
//   const todayKey = new Date().toISOString().split("T")[0]; // e.g. 2025-06-25

//   // ✅ Check if today’s plan already exists
//   const cached = await DailySchedule.findOne({ userID, date: todayKey });
//   if (cached) return NextResponse.json(cached.subtasks);

//   const tasks = await Task.find({
//     userID,
//     status: { $ne: "completed" },
//   });

//   const pending = [];

//   for (const task of tasks) {
//     const weight = sortWeight(task);
//     const subtasks = task.subtasks.filter(
//       (s) => s.subtaskstatus !== "completed"
//     );

//     for (const sub of subtasks) {
//       pending.push({
//         taskID: task._id,
//         taskname: task.taskname,
//         deadline: task.deadline,
//         subtaskID: sub.subtaskID,
//         subtaskname: sub.subtaskname,
//         subtaskdescription: sub.subtaskdescription,
//         subtaskduration: sub.subtaskduration,
//         subtaskstatus: sub.subtaskstatus,
//         weight,
//       });
//     }
//   }

//   pending.sort((a, b) => {
//     if (a.weight.deadline !== b.weight.deadline)
//       return a.weight.deadline - b.weight.deadline;
//     if (a.weight.priorityScore !== b.weight.priorityScore)
//       return b.weight.priorityScore - a.weight.priorityScore;
//     if (a.weight.daysLeft > 3) return b.subtaskduration - a.subtaskduration;
//     return a.subtaskduration - b.subtaskduration;
//   });

//   const todayPlan = [];
//   let used = 0;
//   for (const item of pending) {
//     if (used + item.subtaskduration <= MAX_HOURS) {
//       todayPlan.push(item);
//       used += item.subtaskduration;
//     }
//     if (used >= MAX_HOURS) break;
//   }

//   await DailySchedule.create({
//     userID,
//     date: todayKey,
//     subtasks: todayPlan,
//   });

//   return NextResponse.json(todayPlan);
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import DailySchedule from "@/models/DailySchedule";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  await dbConnect();
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userID = user.id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const schedule = await DailySchedule.findOne({ userID, date: today });
  if (!schedule) {
    return NextResponse.json(
      { message: "No schedule found for today" },
      { status: 404 }
    );
  }

  return NextResponse.json(schedule.subtasks);
}
