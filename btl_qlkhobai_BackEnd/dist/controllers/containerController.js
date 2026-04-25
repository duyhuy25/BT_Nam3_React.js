"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContainers = exports.deleteContainer = exports.updateContainer = exports.addContainer = exports.getContainers = void 0;
const containerService_1 = require("../services/containerService");
const getContainers = async (req, res) => {
    try {
        const data = await (0, containerService_1.fetchContainer)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getContainers = getContainers;
const addContainer = async (req, res) => {
    try {
        await (0, containerService_1.createContainerService)(req.body);
        res.json({ message: "Thêm container thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addContainer = addContainer;
const updateContainer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, containerService_1.updateContainerService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateContainer = updateContainer;
const deleteContainer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, containerService_1.deleteContainerService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteContainer = deleteContainer;
const searchContainers = async (req, res) => {
    try {
        const { search } = req.query;
        const data = await (0, containerService_1.searchContainersService)(String(search || ""));
        res.json(data);
    }
    catch (error) {
        console.error("=== SEARCH ERROR ===", error);
        res.status(500).json({
            message: "Lỗi khi tìm kiếm container",
            detail: error.message
        });
    }
};
exports.searchContainers = searchContainers;
