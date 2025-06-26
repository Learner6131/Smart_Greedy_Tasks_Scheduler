import { currentUser } from "@clerk/nextjs/server";
import dbConnect from "./dbConnect";
import User from "@/models/user";

export default async function getOrCreateUser() {
  await dbConnect();

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("No user is currently authenticated");
  }

  let user = await User.findOne({ clerkId: clerkUser.id });

  if (!user) {
    user = await User.create({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      availability: {},
    });
    await user.save();
    console.log("New user saved");
  }
  return user;
}
