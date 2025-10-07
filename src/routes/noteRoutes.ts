import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
} from "../controllers/noteController";

const router = express.Router();

router.post("/create", createNote);

router.route("/:id").get(getNote).delete(deleteNote);
router.get("/", getAllNotes);

export default router;
