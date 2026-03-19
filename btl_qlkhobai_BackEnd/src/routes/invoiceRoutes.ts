import { Router } from "express";
import { getInvoice } from "../controllers/invoiceController";

const router = Router();

router.get("/invoice", getInvoice);

export default router;