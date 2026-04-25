"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVehicle = exports.deleteVehicle = exports.updateVehicle = exports.addVehicle = exports.getVehicle = void 0;
const vehicleServices_1 = require("../services/vehicleServices");
const getVehicle = async (req, res) => {
    try {
        const data = await (0, vehicleServices_1.fetchVehicle)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getVehicle = getVehicle;
const addVehicle = async (req, res) => {
    try {
        await (0, vehicleServices_1.addVehicleService)(req.body);
        res.status(201).json({ message: "Thêm phương tiện thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addVehicle = addVehicle;
const updateVehicle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await (0, vehicleServices_1.updateVehicleService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await (0, vehicleServices_1.deleteVehicleService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteVehicle = deleteVehicle;
const searchVehicle = async (req, res) => {
    try {
        const keyword = req.query.search || "";
        const data = await (0, vehicleServices_1.searchVehicleService)(keyword);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchVehicle = searchVehicle;
