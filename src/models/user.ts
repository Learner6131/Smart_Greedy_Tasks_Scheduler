import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, unique: true },
  email: String,
  availability: Object,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
