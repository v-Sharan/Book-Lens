import { Router } from "express";
import { check } from "express-validator";
import {
  getAllBook,
  getBookById,
  getBookByUserId,
  createBook,
  updateBook,
  deleteBook,
  favouriteBooks,
} from "../controllers/books/books.js";

const router = Router();

router.get("/", getAllBook);
router.get("/:bookId", getBookById);
router.get("/user/:userId", getBookByUserId);
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("discription").isLength({ min: 5 }),
    check("coverArt").not().isEmpty(),
    check("price").not().isEmpty(),
    // check("category").not().isEmpty(),
  ],
  createBook
);
router.post("/fav", favouriteBooks);
router.patch("/:bookId", updateBook);
router.delete("/:bookId", deleteBook);

export default router;
