import express from "express";
import {
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/noteController";
import { protect } from "../middleware/protect.middleware";
import { restrictToOwnerOrAdmin } from "../middleware/restrictToOwnerOrAdmin.middleware";
import { restrictToAdmin } from "../middleware/restrictToAdmin.middleware";
import { validate } from "../middleware/validateInput.middleware";
import { createUpdateNoteSchema } from "../schemas/createUpdateNote.schema";

const router = express.Router();

router.use(protect);

router.get("/", restrictToAdmin, getAllNotes);

router.use(restrictToOwnerOrAdmin);
router
  .route("/:id")
  .get(getNote)
  .patch(validate(createUpdateNoteSchema), updateNote)
  .delete(deleteNote);

export default router;
