import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BooksSchema = new Schema({
  title: { type: String, required: true },
  coverArt: { type: String, required: true },
  discription: { type: String, required: true },
  price: { type: Number, required: true },
  comment: [
    {
      userId: { type: String, required: true },
      userComment: { type: String, required: true },
      // rating: { type: Number, required: true },
    },
  ],
  category: { type: String, required: true },
  authors: [{ type: String, required: true }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

export const Books = mongoose.model("Books", BooksSchema);
