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
  checkMail,
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

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", login, errorHandler);

//router.post("/forgotPassword", protect, forgotPassword, errorHandler);

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       400:
 *         description: Invalid request
 */
router.post("/forgotPassword", protect, forgotPassword, errorHandler);

/**
 * @swagger
 * /resetPassword/{token}:
 *   patch:
 *     summary: Reset password using token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or request
 */

router.patch("/resetPassword/:token", resetPassword, errorHandler);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the current user
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post("/logout", logout);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *       403:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new user by admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 */
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

router.patch("/updateImage/:id", protect, upload, updateImage, errorHandler);

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

router.post("/checkMail", checkMail, errorHandler);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:id", protect, getUser, errorHandler);

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Create a new user by a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 */
//router.post("/createUser", validateCreation, createUserByUser, errorHandler);

router.post("/createAdmin", createAdmin, errorHandler);

export { router as userRouter };
