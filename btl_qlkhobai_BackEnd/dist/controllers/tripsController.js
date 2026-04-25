"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTrip = exports.deleteTrip = exports.updateTrip = exports.addTrip = exports.getTrip = void 0;
const tripsServices_1 = require("../services/tripsServices");
const getTrip = async (req, res) => {
    try {
        const data = await (0, tripsServices_1.fetchTrip)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getTrip = getTrip;
const addTrip = async (req, res) => {
    try {
        await (0, tripsServices_1.addTripService)(req.body);
        res.json({ message: "Thêm chuyến đi thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addTrip = addTrip;
const updateTrip = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, tripsServices_1.updateTripService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateTrip = updateTrip;
const deleteTrip = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, tripsServices_1.deleteTripService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteTrip = deleteTrip;
const searchTrip = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, tripsServices_1.searchTripService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchTrip = searchTrip;
