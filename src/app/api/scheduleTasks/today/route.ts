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
  const today = new Date().toISOString().slice(0, 10);

  const schedule = await DailySchedule.findOne({ userID, date: today });
  if (!schedule) {
    return NextResponse.json(
      { message: "No schedule found for today" },
      { status: 404 }
    );
  }

  return NextResponse.json(schedule.subtasks);
}
