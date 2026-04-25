"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoiceController_1 = require("../controllers/invoiceController");
const router = express_1.default.Router();
router.get("/invoice", invoiceController_1.getInvoice);
router.get("/invoice/search", invoiceController_1.searchInvoice);
router.post("/addinvoice", invoiceController_1.addInvoice);
router.put("/invoice/:id", invoiceController_1.updateInvoice);
router.delete("/invoice/:id", invoiceController_1.deleteInvoice);
exports.default = router;
