import { Router } from "express";
import {
  getContainers,
  addContainer,
  updateContainer,
  deleteContainer
} from "../controllers/containerController";

const router = Router();

router.get("/container", getContainers);
router.post("/container", addContainer);
router.put("/container/:id", updateContainer);
router.delete("/container/:id", deleteContainer);

export default router;