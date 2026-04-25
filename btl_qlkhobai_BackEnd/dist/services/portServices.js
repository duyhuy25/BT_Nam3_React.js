"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPortService = exports.deletePortService = exports.updatePortService = exports.addPortService = exports.fetchPort = void 0;
const portRepositories_1 = require("../repositories/portRepositories");
const fetchPort = async () => {
    return await (0, portRepositories_1.getAllPort)();
};
exports.fetchPort = fetchPort;
const addPortService = async (data) => {
    return await (0, portRepositories_1.createPort)(data);
};
exports.addPortService = addPortService;
const updatePortService = async (id, data) => {
    return await (0, portRepositories_1.updatePortById)(id, data);
};
exports.updatePortService = updatePortService;
const deletePortService = async (id) => {
    return await (0, portRepositories_1.deletePortById)(id);
};
exports.deletePortService = deletePortService;
const searchPortService = async (keyword) => {
    return await (0, portRepositories_1.searchPortByKeyword)(keyword);
};
exports.searchPortService = searchPortService;
