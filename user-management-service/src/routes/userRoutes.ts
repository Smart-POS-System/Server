import express from "express";
import {
  createUserByAdmin,
  isUserExists,
  validateUser,
} from "../Controllers/userController";
import {
  login,
  protect,
  restrictToCreate,
} from "../Controllers/authController";
import { errorHandler } from "../Controllers/errorController";

const router = express.Router();

router.post("/login", login, errorHandler);

router
  .route("/")
  .post(
    protect,
    isUserExists,
    validateUser,
    restrictToCreate,
    createUserByAdmin,
    errorHandler
  );

export { router as userRouter };
