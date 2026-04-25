"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCostService = exports.deleteCostService = exports.updateCostService = exports.addCostService = exports.fetchCost = void 0;
const costRepositories_1 = require("../repositories/costRepositories");
const fetchCost = async () => {
    return await (0, costRepositories_1.getAllCost)();
};
exports.fetchCost = fetchCost;
const addCostService = async (data) => {
    return await (0, costRepositories_1.createCost)(data);
};
exports.addCostService = addCostService;
const updateCostService = async (id, data) => {
    return await (0, costRepositories_1.updateCostById)(id, data);
};
exports.updateCostService = updateCostService;
const deleteCostService = async (id) => {
    return await (0, costRepositories_1.deleteCostById)(id);
};
exports.deleteCostService = deleteCostService;
const searchCostService = async (keyword) => {
    return await (0, costRepositories_1.searchCostByKeyword)(keyword);
};
exports.searchCostService = searchCostService;
