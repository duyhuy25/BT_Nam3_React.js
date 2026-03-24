import express from "express";
import {
  getContainers,
  addContainer,
  updateContainer,
  deleteContainer,
  searchContainers,
} from "../controllers/containerController";

const router = express.Router();

router.get("/container", getContainers);                   
router.get("/container/search", searchContainers);      
router.post("/addcontainer", addContainer);
router.put("/container/:id", updateContainer);
router.delete("/container/:id", deleteContainer);

export default router;