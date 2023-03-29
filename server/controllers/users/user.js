import { validationResult } from "express-validator";

import { HttpError } from "../../utils/HttpError.js";
import { User } from "../../mongodb/schemas/userSchema.js";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Could not find any Users", 500));
  }
  res.json({ users: users });
};

export const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, userProfile, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exist already, please login.", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    userProfile,
    password,
    books: [],
    favourite: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing in faild, try again later", 201);
    return next(error);
  }
  res.json({ user: createdUser.toObject() });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  let showUser;

  try {
    existingUser = await User.findOne({ email: email });
    showUser = await User.findOne({ email: email }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  res.json({ user: showUser });
};
