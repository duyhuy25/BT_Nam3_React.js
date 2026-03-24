import { Router } from "express";
import {
  getContainerHistorys,
  addContainerHistory,
  updateContainerHistory,
  deleteContainerHistory,
  searchContainerHistory,
} from "../controllers/containerHistoryController";

const router = Router();

router.get("/containerhistory", getContainerHistorys);

router.get("/containerhistory/search", searchContainerHistory);

router.post("/addcontainerhistory", addContainerHistory);

router.put("/containerhistory/:id", updateContainerHistory);

router.delete("/containerhistory/:id", deleteContainerHistory);

export default router;