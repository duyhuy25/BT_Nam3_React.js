"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWarehouseService = exports.deleteWarehouseService = exports.updateWarehouseService = exports.addWarehouseService = exports.fetchWarehouse = void 0;
const warehousesRepository_1 = require("../repositories/warehousesRepository");
const fetchWarehouse = async () => {
    return await (0, warehousesRepository_1.getAllWarehouse)();
};
exports.fetchWarehouse = fetchWarehouse;
const addWarehouseService = async (data) => {
    if (!data.TenKho || !data.SucChua) {
        throw new Error("Thiếu thông tin bắt buộc");
    }
    return await (0, warehousesRepository_1.createWarehouse)(data);
};
exports.addWarehouseService = addWarehouseService;
const updateWarehouseService = async (id, data) => {
    const result = await (0, warehousesRepository_1.updateWarehouseById)(id, data);
    if (result.rowsAffected[0] === 0) {
        throw new Error("Không tìm thấy kho");
    }
    return result;
};
exports.updateWarehouseService = updateWarehouseService;
const deleteWarehouseService = async (id) => {
    return await (0, warehousesRepository_1.deleteWarehouseById)(id);
};
exports.deleteWarehouseService = deleteWarehouseService;
const searchWarehouseService = async (keyword) => {
    return await (0, warehousesRepository_1.searchWarehouseByKeyword)(keyword);
};
exports.searchWarehouseService = searchWarehouseService;
