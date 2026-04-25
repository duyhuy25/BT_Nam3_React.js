"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHistoryService = exports.deleteHistoryService = exports.updateHistoryService = exports.createHistoryService = exports.fetchHistory = void 0;
const containerHistoryRepository_1 = require("../repositories/containerHistoryRepository");
const fetchHistory = async () => {
    return await (0, containerHistoryRepository_1.getAllContainerHistory)();
};
exports.fetchHistory = fetchHistory;
const createHistoryService = async (data) => {
    return await (0, containerHistoryRepository_1.createHistory)(data);
};
exports.createHistoryService = createHistoryService;
const updateHistoryService = async (id, data) => {
    return await (0, containerHistoryRepository_1.updateHistory)(id, data);
};
exports.updateHistoryService = updateHistoryService;
const deleteHistoryService = async (id) => {
    return await (0, containerHistoryRepository_1.deleteHistory)(id);
};
exports.deleteHistoryService = deleteHistoryService;
const searchHistoryService = async (search) => {
    return await (0, containerHistoryRepository_1.searchHistory)(search);
};
exports.searchHistoryService = searchHistoryService;
