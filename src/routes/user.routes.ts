import express from "express";
import {
  getUserInfoById,
  forgetAccountPassword,
  loginUser,
  logoutUser,
  registerUser,
  verifyPasswordResetToken,
  updateProfile,
  getUsers,
  verifyEmailToken,
} from "../controllers/user.controller";
import { authAdmin, authClient } from "../middlewares";
const router = express.Router();

//ADMIN
router.route("/admin/register").post(authAdmin, registerUser);
router.route("/admin/users").get(authAdmin, getUsers);

//CLIENT
router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/forgetPassword").post(forgetAccountPassword);
router.route("/user/resetPassword/auth/:token").post(verifyPasswordResetToken);
router.route("/user/verifyEmail/:token").post(verifyEmailToken);
router.route("/user").get(authClient, getUserInfoById);
router.route("/user").patch(authClient, updateProfile);
router.route("/user/logout").post(authClient, logoutUser);

export default router;
