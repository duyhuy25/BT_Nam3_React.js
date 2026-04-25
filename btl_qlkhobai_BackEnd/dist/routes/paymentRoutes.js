"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const router = express_1.default.Router();
router.get("/invoice/:hoaDonId", paymentController_1.getPayments);
router.post("/addpayment", paymentController_1.addPayment);
router.delete("/:id", paymentController_1.deletePayment);
exports.default = router;
