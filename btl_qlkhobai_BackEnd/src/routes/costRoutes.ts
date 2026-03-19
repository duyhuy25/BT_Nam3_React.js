import { Router } from "express";
import { getCosts } from "../controllers/costController";

const router = Router();

router.get("/cost", getCosts);

export default router;