import React from "react";
import ProfileForm from "@/components/Addtasks";
import getOrCreateUser from "@/lib/getOrCreateUser";
import { redirect } from "next/navigation";

async function AddTasks() {
  const user = await getOrCreateUser();
  console.log("User fetched:", user);

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <ProfileForm />
    </div>
  );
}

export default AddTasks;
