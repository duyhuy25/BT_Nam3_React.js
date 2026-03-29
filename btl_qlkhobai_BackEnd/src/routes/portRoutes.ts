import express from "express";
import {
  getPort,
  addPort,
  updatePort,
  deletePort,
  searchPort
} from "../controllers/portController";

const router = express.Router();

router.get("/port", getPort);
router.get("/port/search", searchPort);
router.post("/addport", addPort);
router.put("/port/:id", updatePort);
router.delete("/port/:id", deletePort);

export default router;