import mongoose from "mongoose";

export interface IUser {
  _id: string;
  email: string;
  role: mongoose.Types.ObjectId;
}
