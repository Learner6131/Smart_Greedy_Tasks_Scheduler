import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import DailySchedule from "@/models/DailySchedule";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
  await dbConnect();
  const user = await currentUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userID = user.id;
  const { subtaskID, newStatus } = await req.json();
  const today = new Date().toISOString().slice(0, 10);

  const result = await DailySchedule.findOneAndUpdate(
    { userID, date: today, "subtasks.subtaskID": subtaskID },
    { $set: { "subtasks.$.subtaskstatus": newStatus } }
  );

  return NextResponse.json({ message: "DailySchedule updated", result });
}
