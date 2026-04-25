"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const portController_1 = require("../controllers/portController");
const router = express_1.default.Router();
router.get("/port", portController_1.getPort);
router.get("/port/search", portController_1.searchPort);
router.post("/addport", portController_1.addPort);
router.put("/port/:id", portController_1.updatePort);
router.delete("/port/:id", portController_1.deletePort);
exports.default = router;
