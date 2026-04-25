"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const costController_1 = require("../controllers/costController");
const router = express_1.default.Router();
router.get("/cost", costController_1.getCosts);
router.get("/cost/search", costController_1.searchCosts);
router.post("/addcost", costController_1.addCost);
router.put("/cost/:id", costController_1.updateCost);
router.delete("/cost/:id", costController_1.deleteCost);
exports.default = router;
