import express from "express";
import { login, signup } from "../controllers/authController";
import { validate } from "../middleware/validateInput.middleware";
import { signupSchema } from "../schemas/signup.schema";
import { loginSchema } from "../schemas/login.schema";
import { protect } from "../middleware/protect.middleware";
import {
  createNote,
  getUser,
  getUserNotes,
} from "../controllers/userController";

const router = express.Router();

//auth routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

router.use(protect);

router.get("/me", getUser);

router.route("/me/notes").get(getUserNotes).post(createNote);

export default router;
