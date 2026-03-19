import { Router } from "express";
import { getVehicle } from "../controllers/vehicleController";

const router = Router();

router.get("/vehicle", getVehicle);

export default router;