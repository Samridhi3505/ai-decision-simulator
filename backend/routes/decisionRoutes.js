import express from "express";
import {
  createDecision,
  getDecisions,
  deleteDecision
} from "../controllers/decisionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDecision);
router.get("/", protect, getDecisions);
router.delete("/:id", protect, deleteDecision);

export default router;