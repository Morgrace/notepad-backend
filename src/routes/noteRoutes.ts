import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/noteController";

const router = express.Router();

router.post("/create", createNote);

router.route("/:id").get(getNote).patch(updateNote).delete(deleteNote);
router.get("/", getAllNotes);

export default router;
