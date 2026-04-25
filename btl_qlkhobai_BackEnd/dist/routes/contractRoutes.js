"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contractController_1 = require("../controllers/contractController");
const router = express_1.default.Router();
router.get("/contract", contractController_1.getContracts);
router.get("/contract/search", contractController_1.searchContracts);
router.post("/addcontract", contractController_1.addContract);
router.put("/contract/:id", contractController_1.updateContract);
router.delete("/contract/:id", contractController_1.deleteContract);
exports.default = router;
