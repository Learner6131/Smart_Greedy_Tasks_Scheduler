import Task from "@/models/task";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { Subtask } from "@/types/types";

// // export async function PUT(
// //   req: Request,
// //   { params }: { params: { id: string; subtaskID: string } }
// // ) {
// //   try {
// //     await dbConnect();
// //     const body = await req.json();

// //     const task = await Task.findById(params.id);
// //     if (!task)
// //       return NextResponse.json({ error: "Task not found" }, { status: 404 });

// //     const subtask = task.subtasks.find(
// //       (s: any) => s.subtaskID === params.subtaskID
// //     );
// //     if (!subtask)
// //       return NextResponse.json({ error: "Subtask not found" }, { status: 404 });

// //     subtask.subtaskstatus = body.subtaskstatus;
// //     await task.save();

// //     return NextResponse.json({ message: "Subtask updated successfully", task });
// //   } catch (error) {
// //     return NextResponse.json(
// //       { error: "Failed to update subtask" },
// //       { status: 500 }
// //     );
// //   }
// // }

// type Subtask = {
//   subtaskID: string;
//   subtaskname: string;
//   subtaskdescription: string;
//   subtaskduration: number;
//   subtaskstatus: string;
// };

// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string; subtaskID: string }> }
// ) {
//   try {
//     await dbConnect();
//     const { subtaskstatus } = await req.json();
//     const { id, subtaskID } = await params;

//     const task = await Task.findById(id);
//     if (!task)
//       return NextResponse.json({ error: "Task not found" }, { status: 404 });

//     const subtask = (task.subtasks as Subtask[]).find(
//       (s: Subtask) => s.subtaskID === subtaskID
//     );
//     if (!subtask)
//       return NextResponse.json({ error: "Subtask not found" }, { status: 404 });

//     subtask.subtaskstatus = subtaskstatus;

//     // ✅ Determine overall task status
//     const allCompleted = task.subtasks.every(
//       (s: Subtask) => s.subtaskstatus === "completed"
//     );
//     const anyWorked = task.workedDuration > 0;

//     task.status = allCompleted
//       ? "completed"
//       : anyWorked
//       ? "ongoing"
//       : "pending";

//     await task.save();
//     return NextResponse.json(task);
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(error.message);
//     } else {
//       console.error(error);
//     }
//     return NextResponse.json(
//       { error: "Failed to update subtask" },
//       { status: 500 }
//     );
//   }
// }

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

    // Find subtask in the DocumentArray
    const subtask = task.subtasks.find(
      (s: Subtask) => s.subtaskID === subtaskID
    );
    if (!subtask)
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });

    subtask.subtaskstatus = subtaskstatus;

    const allCompleted = task.subtasks.every(
      (s: Subtask) => s.subtaskstatus === "completed"
    );
    const anyWorked = task.workedDuration > 0;

    task.status = allCompleted
      ? "completed"
      : anyWorked
      ? "ongoing"
      : "pending";

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
