import express from "express";
import {
  getPayments,
  addPayment,
  deletePayment
} from "../controllers/paymentController";

const router = express.Router();

router.get("/invoice/:hoaDonId", getPayments);
router.post("/addpayment", addPayment);
router.delete("/:id", deletePayment);

export default router;
