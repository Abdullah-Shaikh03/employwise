import mongoose from "mongoose";
import { IUser } from "@/lib/Interfaces/UserInterface";

const userModel = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "This Field is required"],
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, "This Field is required"],
    },
    lastName: {
      type: String,
      required: [true, "This Field is required"],
    },
    password: {
      type: String,
      required: [true, "This Field is required"],
    },
  },
  { timestamps: true }
);

const userSchema =
  mongoose.models.User || mongoose.model<IUser>("User", userModel);

export default userSchema;


