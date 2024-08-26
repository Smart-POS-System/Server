import express from "express";
import {
  createUserByAdmin,
  updatePasswordByUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  activateUser,
  updateLoggedUser,
  createAdmin,
  updateImage,
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
  validateMe,
  validateUser,
} from "../Middleware/employeeMiddlewares";
import { upload } from "../Utils/getImageLink";

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
    upload,
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

router.patch("updateImage/:id", protect, upload, updateImage, errorHandler);

router.patch(
  "/updateMe/:id",
  protect,
  upload,
  validateMe,
  validateUser,
  updateLoggedUser,
  errorHandler
);

router.patch(
  "/activate/:id",
  protect,
  restrictTo("General Manager"),
  activateUser,
  errorHandler
);

router.post(
  "/updatePassword",
  protect,
  validateCreation,
  updatePasswordByUser,
  errorHandler
);

router.post("/createAdmin", createAdmin, errorHandler);

export { router as userRouter };
