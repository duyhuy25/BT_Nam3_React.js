"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemTypeController_1 = require("../controllers/itemTypeController");
const router = express_1.default.Router();
router.get("/itemtype", itemTypeController_1.getItemtypes);
router.get("/itemtype/search", itemTypeController_1.searchItemtype);
router.post("/additemtype", itemTypeController_1.addItemtype);
router.put("/itemtype/:id", itemTypeController_1.updateItemtype);
router.delete("/itemtype/:id", itemTypeController_1.deleteItemtype);
exports.default = router;
