"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPort = exports.deletePort = exports.updatePort = exports.addPort = exports.getPort = void 0;
const portServices_1 = require("../services/portServices");
const getPort = async (req, res) => {
    try {
        const data = await (0, portServices_1.fetchPort)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getPort = getPort;
const addPort = async (req, res) => {
    try {
        await (0, portServices_1.addPortService)(req.body);
        res.json({ message: "Thêm cảng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addPort = addPort;
const updatePort = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, portServices_1.updatePortService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updatePort = updatePort;
const deletePort = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, portServices_1.deletePortService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deletePort = deletePort;
const searchPort = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, portServices_1.searchPortService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchPort = searchPort;
