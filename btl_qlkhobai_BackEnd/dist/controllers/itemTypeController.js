"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItemtype = exports.deleteItemtype = exports.updateItemtype = exports.addItemtype = exports.getItemtypes = void 0;
const itemtypeServices_1 = require("../services/itemtypeServices");
const getItemtypes = async (req, res) => {
    try {
        const data = await (0, itemtypeServices_1.fetchItemType)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getItemtypes = getItemtypes;
const addItemtype = async (req, res) => {
    try {
        await (0, itemtypeServices_1.addItemTypeService)(req.body);
        res.json({ message: "Thêm loại hàng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addItemtype = addItemtype;
const updateItemtype = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, itemtypeServices_1.updateItemTypeService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateItemtype = updateItemtype;
const deleteItemtype = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, itemtypeServices_1.deleteItemTypeService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteItemtype = deleteItemtype;
const searchItemtype = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, itemtypeServices_1.searchItemTypeService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchItemtype = searchItemtype;
