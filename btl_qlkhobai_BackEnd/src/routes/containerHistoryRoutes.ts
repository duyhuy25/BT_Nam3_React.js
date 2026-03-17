import { Router } from "express";
import { getContainerHistorys } from "../controllers/containerHistoryController";

const router = Router();

router.get("/containerhistory", getContainerHistorys);

export default router;