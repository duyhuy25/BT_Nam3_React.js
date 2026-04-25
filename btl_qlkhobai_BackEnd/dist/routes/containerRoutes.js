"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const containerController_1 = require("../controllers/containerController");
const router = express_1.default.Router();
router.get("/container", containerController_1.getContainers);
router.get("/container/search", containerController_1.searchContainers);
router.post("/addcontainer", containerController_1.addContainer);
router.put("/container/:id", containerController_1.updateContainer);
router.delete("/container/:id", containerController_1.deleteContainer);
exports.default = router;
