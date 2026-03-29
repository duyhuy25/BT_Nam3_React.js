import express from "express";
import {
  getItemtypes,
  addItemtype,
  updateItemtype,
  deleteItemtype,
  searchItemtype
} from "../controllers/itemTypeController";

const router = express.Router();

router.get("/itemtype", getItemtypes);
router.get("/itemtype/search", searchItemtype);
router.post("/additemtype", addItemtype);
router.put("/itemtype/:id", updateItemtype);
router.delete("/itemtype/:id", deleteItemtype);

export default router;