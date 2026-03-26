import express from "express";
import {
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomer
} from "../controllers/customerController";

const router = express.Router();

router.get("/customer", getCustomer);
router.get("/customer/search", searchCustomer);
router.post("/addcustomer", addCustomer);
router.put("/customer/:id", updateCustomer);
router.delete("/customer/:id", deleteCustomer);

export default router;