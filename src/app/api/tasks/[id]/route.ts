import Task from "@/models/task";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Subtask } from "@/types/types";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const body = await req.json();
    const task = await Task.findById(params.id);

    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    if (body.status === "completed") {
      task.subtasks = task.subtasks.map((sub: Subtask) => ({
        ...sub,
        subtaskstatus: "completed",
      }));
    }

    task.status = body.status;
    await task.save();

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    await Task.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
