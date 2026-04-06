import { Router } from "express";
import {
  getVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicle,
} from "../controllers/vehicleController";

const router = Router();

router.get("/vehicle", getVehicle);
router.get("/vehicle/search", searchVehicle);
router.post("/vehicle", addVehicle);
router.put("/vehicle/:id", updateVehicle);
router.delete("/vehicle/:id", deleteVehicle);

export default router;