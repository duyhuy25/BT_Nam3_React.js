"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCosts = exports.deleteCost = exports.updateCost = exports.addCost = exports.getCosts = void 0;
const costServices_1 = require("../services/costServices");
const getCosts = async (req, res) => {
    try {
        const data = await (0, costServices_1.fetchCost)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getCosts = getCosts;
const addCost = async (req, res) => {
    try {
        await (0, costServices_1.addCostService)(req.body);
        res.json({ message: "Thêm chi phí thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addCost = addCost;
const updateCost = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, costServices_1.updateCostService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateCost = updateCost;
const deleteCost = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, costServices_1.deleteCostService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteCost = deleteCost;
const searchCosts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const data = await (0, costServices_1.searchCostService)(keyword);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchCosts = searchCosts;
