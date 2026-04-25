"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tripsController_1 = require("../controllers/tripsController");
const router = express_1.default.Router();
router.get("/trip", tripsController_1.getTrip);
router.get("/trip/search", tripsController_1.searchTrip);
router.post("/addtrip", tripsController_1.addTrip);
router.put("/trip/:id", tripsController_1.updateTrip);
router.delete("/trip/:id", tripsController_1.deleteTrip);
exports.default = router;
