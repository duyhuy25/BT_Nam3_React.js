import { Router } from "express";
import {
  getWarehouses,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  searchWarehouse,
} from "../controllers/warehousesController";

const router = Router();

router.get("/warehouse", getWarehouses);
router.get("/warehouse/search", searchWarehouse);
router.post("/warehouse", addWarehouse);
router.put("/warehouse/:id", updateWarehouse);
router.delete("/warehouse/:id", deleteWarehouse);

export default router;