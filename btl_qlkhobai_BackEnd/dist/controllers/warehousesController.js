"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWarehouse = exports.deleteWarehouse = exports.updateWarehouse = exports.addWarehouse = exports.getWarehouses = void 0;
const warehouseServices_1 = require("../services/warehouseServices");
const getWarehouses = async (req, res) => {
    try {
        const data = await (0, warehouseServices_1.fetchWarehouse)();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getWarehouses = getWarehouses;
const addWarehouse = async (req, res) => {
    try {
        await (0, warehouseServices_1.addWarehouseService)(req.body);
        res.status(201).json({ message: "Thêm kho thành công" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.addWarehouse = addWarehouse;
const updateWarehouse = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await (0, warehouseServices_1.updateWarehouseService)(id, req.body);
        res.json({ message: "Cập nhật kho thành công" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateWarehouse = updateWarehouse;
const deleteWarehouse = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await (0, warehouseServices_1.deleteWarehouseService)(id);
        res.json({ message: "Xóa kho thành công" });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteWarehouse = deleteWarehouse;
const searchWarehouse = async (req, res) => {
    try {
        const keyword = req.query.search || "";
        const data = await (0, warehouseServices_1.searchWarehouseService)(keyword);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchWarehouse = searchWarehouse;
