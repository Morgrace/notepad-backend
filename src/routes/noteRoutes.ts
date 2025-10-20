import express from "express";
import {
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/noteController";
import { protect } from "../middleware/auth/protect.middleware";
import { restrictToOwnerOrAdmin } from "../middleware/auth/restrictToOwnerOrAdmin.middleware";

const router = express.Router();

router.use(protect);

router
  .route("/:id")
  .get(restrictToOwnerOrAdmin, getNote)
  .patch(restrictToOwnerOrAdmin, updateNote)
  .delete(restrictToOwnerOrAdmin, deleteNote);

router.get("/", getAllNotes);

export default router;
