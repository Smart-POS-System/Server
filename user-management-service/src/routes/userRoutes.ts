import express from "express";
import {
  createUserByAdmin,
  isUserExists,
  validateUser,
} from "../Controllers/userController";
import { login, protect } from "../Controllers/authController";
import { errorHandler } from "../Controllers/errorController";

const router = express.Router();

router.post("/login", login, errorHandler);

router
  .route("/")
  .post(protect, isUserExists, validateUser, createUserByAdmin, errorHandler);

export { router as userRouter };
