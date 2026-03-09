import { Router } from "express";
import { getContainerHistory } from "../controllers/containerHistoryController";

const router = Router();

router.get("/containerhistory", getContainerHistory);

export default router;