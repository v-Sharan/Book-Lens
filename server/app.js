import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { HttpError } from "./utils/HttpError.js";
import BooksRoutes from "./routes/books.js";
import UsersRoutes from "./routes/users.js";
import * as dotenv from "dotenv";
import { ConnectDB } from "./mongodb/connect.js";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/books", BooksRoutes);
app.use("/api/users", UsersRoutes);

app.get("/", (req, res, next) => {
  try {
    res.send("Welcome to E-books");
  } catch (error) {
    const err = new HttpError("No Routes Found.", 404);
    return next(err);
  }
});

const startServer = () => {
  try {
    ConnectDB(process.env.MONGODB_URL);
    app.listen(8080, () => {
      console.log("http://localhost:8080");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
