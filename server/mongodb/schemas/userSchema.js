import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userProfile: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    favourite: [
      { type: mongoose.Types.ObjectId, required: true, ref: "Books" },
    ],
    books: [{ type: mongoose.Types.ObjectId, required: true, ref: "Books" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
