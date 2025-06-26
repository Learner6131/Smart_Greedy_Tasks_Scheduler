import Task from "@/models/task";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Subtask } from "@/types/types";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; subtaskID: string }> }
) {
  try {
    await dbConnect();
    const { id, subtaskID } = await params; // await params from context
    const { subtaskstatus } = await req.json();

    const task = await Task.findById(id);
    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const subtask = task.subtasks.find(
      (s: Subtask) => s.subtaskID === subtaskID
    );
    if (!subtask)
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });

    subtask.subtaskstatus = subtaskstatus;
    if (subtaskstatus === "completed") {
      task.workedDuration += subtask.subtaskduration;
      task.remainingDuration = task.duration - task.workedDuration;
    } else {
      task.workedDuration -= subtask.subtaskduration;
      task.remainingDuration = task.duration - task.workedDuration;
    }
    task.workedDuration = Math.max(
      0,
      Math.min(task.workedDuration, task.duration)
    );

    const allCompleted = task.subtasks.every(
      (s: Subtask) => s.subtaskstatus === "completed"
    );
    const anyWorked = task.workedDuration > 0;

    task.status = allCompleted
      ? "completed"
      : anyWorked
      ? "ongoing"
      : "pending";

    if (allCompleted) {
      task.workedDuration = task.duration;
    }

    await task.save();
    return NextResponse.json(task);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    return NextResponse.json(
      { error: "Failed to update subtask" },
      { status: 500 }
    );
  }
}
