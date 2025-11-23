import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from "../controllers/authController";
import { validate } from "../middleware/validateInput.middleware";
import { signupSchema } from "../schemas/signup.schema";
import { loginSchema } from "../schemas/login.schema";
import { protect } from "../middleware/protect.middleware";
import {
  createNote,
  getUser,
  getUserNotes,
} from "../controllers/userController";
import { forgotPasswordSchema } from "../schemas/forgotPassword.schema";
import { resetPasswordSchema } from "../schemas/resetPassword.schema";

const router = express.Router();

// Authentication routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/forgotPassword", validate(forgotPasswordSchema), forgotPassword);
router.patch(
  "/resetPassword/:token",
  validate(resetPasswordSchema),
  resetPassword
);

router.use(protect);

router.get("/me", getUser);

// Exclusive user notes
router.route("/me/notes").get(getUserNotes).post(createNote);

export default router;
