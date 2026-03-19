import { Router } from "express";
import { getCustomer } from "../controllers/customerController";

const router = Router();

router.get("/customer", getCustomer);

export default router;