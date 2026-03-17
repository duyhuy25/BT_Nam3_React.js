import { Router } from "express";
import { getItemtypes } from "../controllers/itemTypeController";

const router = Router();

router.get("/itemtype", getItemtypes);

export default router;