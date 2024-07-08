import express from "express";
import {
  createUserByAdmin,
  createUserByUser,
  getAllUsers,
  isUserExists,
  sendMailToUser,
  validateCreation,
  validateUser,
} from "../Controllers/userController";
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  restrictTo,
  restrictToCreate,
} from "../Controllers/authController";
import { errorHandler } from "../Controllers/errorController";

const router = express.Router();

router.post("/login", login, errorHandler);
router.post("/forgotPassword", forgotPassword, errorHandler);
router.patch("/resetPassword/:token", resetPassword, errorHandler);
router.get("/logout", logout);

router
  .route("/")
  .get(protect, restrictTo("General Manager"), getAllUsers, errorHandler)
  .post(
    protect,
    isUserExists,
    validateUser,
    restrictToCreate,
    sendMailToUser,
    createUserByAdmin,
    errorHandler
  );

router.post("/createUser", validateCreation, createUserByUser, errorHandler);

export { router as userRouter };
