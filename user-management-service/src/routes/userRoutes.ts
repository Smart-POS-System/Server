import express from "express";
import {
  createUserByAdmin,
  isUserExists,
  validateUser,
} from "../Controllers/userController";
import { login } from "../Controllers/authController";

const router = express.Router();

router.post("/login", login);

router.route("/").post(isUserExists, validateUser, createUserByAdmin);

export { router as userRouter };
