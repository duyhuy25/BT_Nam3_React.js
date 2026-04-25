"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
router.get("/customer", customerController_1.getCustomer);
router.get("/customer/search", customerController_1.searchCustomer);
router.post("/addcustomer", customerController_1.addCustomer);
router.put("/customer/:id", customerController_1.updateCustomer);
router.delete("/customer/:id", customerController_1.deleteCustomer);
exports.default = router;
