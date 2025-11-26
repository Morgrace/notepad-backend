import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  updateMyPassword,
} from "../controllers/authController";
import {
  createNote,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getMyNotes,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/userController";
import { protect } from "../middleware/protect.middleware";
import { validate } from "../middleware/validateInput.middleware";
import { forgotPasswordSchema } from "../schemas/forgotPassword.schema";
import { loginSchema } from "../schemas/login.schema";
import { resetPasswordSchema } from "../schemas/resetPassword.schema";
import { signupSchema } from "../schemas/signup.schema";
import { updateMeSchema } from "../schemas/updateMe.schema";
import { updatePasswordSchema } from "../schemas/updatePassword.schema";
import { upload } from "../utils/multer";
import { restrictToAdmin } from "../middleware/restrictToAdmin.middleware";
import { createUpdateNoteSchema } from "../schemas/createUpdateNote.schema";

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

router.patch(
  "/updateMyPassword",
  validate(updatePasswordSchema),
  updateMyPassword
);

router.patch(
  "/updateMe",
  upload.single("photo"),
  validate(updateMeSchema),
  updateMe
);
router.delete("/deleteMe", deleteMe);

// Exclusive user notes
router.get("/me", getMe);
router
  .route("/me/notes")
  .get(getMyNotes)
  .post(validate(createUpdateNoteSchema), createNote);

// Admin routes
router.use(restrictToAdmin);
router.route("/").get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
export default router;
