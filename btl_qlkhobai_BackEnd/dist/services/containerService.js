"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContainersService = exports.deleteContainerService = exports.updateContainerService = exports.createContainerService = exports.fetchContainer = void 0;
const containerRepository_1 = require("../repositories/containerRepository");
const fetchContainer = async () => {
    return await (0, containerRepository_1.getAllContainer)();
};
exports.fetchContainer = fetchContainer;
const containerHistoryRepository_1 = require("../repositories/containerHistoryRepository");
const createContainerService = async (data) => {
    const result = await (0, containerRepository_1.createContainer)(data);
    if (result.recordset && result.recordset.length > 0) {
        const newContainerID = result.recordset[0].ContainerID;
        await (0, containerHistoryRepository_1.createHistory)({
            ContainerID: newContainerID,
            ThoiGian: new Date(),
            HoatDong: 'Tạo mới container',
            ViTri: 'Chưa xác định'
        });
    }
    return result;
};
exports.createContainerService = createContainerService;
const updateContainerService = async (id, data) => {
    return await (0, containerRepository_1.updateContainer)(id, data);
};
exports.updateContainerService = updateContainerService;
const deleteContainerService = async (id) => {
    return await (0, containerRepository_1.deleteContainer)(id);
};
exports.deleteContainerService = deleteContainerService;
const searchContainersService = async (searchTerm = "") => {
    return await (0, containerRepository_1.searchContainer)(searchTerm);
};
exports.searchContainersService = searchContainersService;
