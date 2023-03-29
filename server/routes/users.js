import { Router } from "express";
import { check } from "express-validator";
import {
  getAllUsers,
  createUser,
  loginUser,
} from "../controllers/users/user.js";

const router = Router();

router.get("/", getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("userProfile").not().isEmpty(),
  ],
  createUser
);

router.post("/login", loginUser);

export default router;
