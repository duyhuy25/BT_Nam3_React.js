"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVehicleService = exports.deleteVehicleService = exports.updateVehicleService = exports.addVehicleService = exports.fetchVehicle = void 0;
const vehicleRepositories_1 = require("../repositories/vehicleRepositories");
const fetchVehicle = async () => {
    return await (0, vehicleRepositories_1.getAllVehicle)();
};
exports.fetchVehicle = fetchVehicle;
const addVehicleService = async (data) => {
    if (!data.LoaiPhuongTien || !data.BienSo) {
        throw new Error("Thiếu thông tin bắt buộc");
    }
    return await (0, vehicleRepositories_1.createVehicle)(data);
};
exports.addVehicleService = addVehicleService;
const updateVehicleService = async (id, data) => {
    return await (0, vehicleRepositories_1.updateVehicleById)(id, data);
};
exports.updateVehicleService = updateVehicleService;
const deleteVehicleService = async (id) => {
    return await (0, vehicleRepositories_1.deleteVehicleById)(id);
};
exports.deleteVehicleService = deleteVehicleService;
const searchVehicleService = async (keyword) => {
    return await (0, vehicleRepositories_1.searchVehicleByKeyword)(keyword);
};
exports.searchVehicleService = searchVehicleService;
