import { Router } from "express";
import { getTrip } from "../controllers/tripsController";

const router = Router();

router.get("/trip", getTrip);

export default router;