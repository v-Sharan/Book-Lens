import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { HttpError } from "../../utils/HttpError.js";
import { User } from "../../mongodb/schemas/userSchema.js";
import { Books } from "../../mongodb/schemas/bookSchema.js";

export const getAllBook = async (req, res, next) => {
  let books;
  try {
    books = await Books.find();
  } catch (err) {
    return next(new HttpError("Could not find any Books", 500));
  }
  res.json({ books: books });
};

export const getBookById = async (req, res, next) => {
  const bookId = req.params.bookId;

  let book;
  try {
    book = await Books.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a book",
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError(
      "Could not find a book for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ book: book.toObject() });
};

export const getBookByUserId = async (req, res, next) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId).populate("books");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a User",
      500
    );
    return next(error);
  }

  if (!user || !user.books.length === 0) {
    const error = new HttpError(
      "Could not find a User for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ books: user.books.map((book) => book.toObject()) });
};

export const createBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, coverArt, discription, price, creator } = req.body;

  let user;

  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating Bokk failed, try again later.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user for provided id", 404);
    return next(error);
  }

  const createdBook = new Books({
    title,
    coverArt,
    discription,
    price,
    creator,
    category: "some New",
    comment: [],
    authors: [],
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBook.save({ session: sess });
    user.books.push(createdBook);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Books failed, Please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ Book: createdBook });
};

export const updateBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const bookId = req.params.bookId;

  const { title, coverArt, discription, price, category, authors } = req.body;

  let book;
  try {
    book = await Books.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not update a Book",
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError(
      "Could not find a Book for the provided id.",
      404
    );
    return next(error);
  }

  const UpdatedBook = await Books.findOneAndUpdate(bookId, {
    title,
    coverArt,
    discription,
    price,
    category,
    authors,
  });

  res.json({ updated: UpdatedBook });
};

export const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;

  let book;
  try {
    book = await Books.findById(bookId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not delete a place",
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError("Could not find  place for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await book.deleteOne({ session: sess });
    book.creator.books.pull(book);
    await book.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not delete a Book",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

export const favouriteBooks = async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  let book, user;

  try {
    book = await Books.findById(bookId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a Book",
      500
    );
    return next(error);
  }

  if (!book) {
    const error = new HttpError(
      "Something went wrong, Could not find a Book",
      404
    );
    return next(error);
  }

  try {
    user = await User.find({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a User",
      500
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await book.save({ session: sess });
    user.favourite.push(book);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating Books failed, Please try again.",
      500
    );
    return next(error);
  }

  res.json({ fav: user });
};
