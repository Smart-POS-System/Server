import express from "express";
import {
  // createAdmin,
  createUserByAdmin,
  updatePasswordByUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
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
router.post("/forgotPassword", protect, forgotPassword, errorHandler);
router.patch("/resetPassword/:token", resetPassword, errorHandler);
router.get("/logout", logout);

router
  .route("/")
  .get(protect, getUsers, errorHandler)
  .post(
    protect,
    validateUser,
    isUserExists,
    restrictToCreate,
    sendMailToUser,
    createUserByAdmin,
    errorHandler
  );

router
  .route("/:id")
  .get(protect, getUser, errorHandler)
  .patch(protect, validateUser, updateUser, errorHandler)
  .delete(protect, restrictTo("General Manager"), deleteUser, errorHandler);

router.post(
  "/updatePassword",
  protect,
  validateCreation,
  updatePasswordByUser,
  errorHandler
);

//router.post("/createAdmin", createAdmin, errorHandler);

export { router as userRouter };
