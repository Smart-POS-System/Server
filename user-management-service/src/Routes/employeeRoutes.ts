import express from "express";
import {
  // createAdmin,
  createUserByAdmin,
  createUserByUser,
  getOneUser,
  getUsers,
} from "../Controllers/employeeController";
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
import {
  isUserExists,
  sendMailToUser,
  validateCreation,
  validateUser,
} from "../Middleware/employeeMiddlewares";

const router = express.Router();

router.post("/login", login, errorHandler);
router.post("/forgotPassword", forgotPassword, errorHandler);
router.patch("/resetPassword/:token", resetPassword, errorHandler);
router.get("/logout", logout);

router
  .route("/")
  .get(protect, getUsers, errorHandler)
  .post(
    protect,
    isUserExists,
    validateUser,
    restrictToCreate,
    sendMailToUser,
    createUserByAdmin,
    errorHandler
  );

router.get("/:id", protect, getOneUser, errorHandler);

router.post("/createUser", validateCreation, createUserByUser, errorHandler);

//router.post("/createAdmin", createAdmin);

export { router as userRouter };
