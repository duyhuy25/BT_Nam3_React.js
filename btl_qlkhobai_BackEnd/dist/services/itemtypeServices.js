"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItemTypeService = exports.deleteItemTypeService = exports.updateItemTypeService = exports.addItemTypeService = exports.fetchItemType = void 0;
const itemtypeRepository_1 = require("../repositories/itemtypeRepository");
const fetchItemType = async () => {
    return await (0, itemtypeRepository_1.getAllItemtype)();
};
exports.fetchItemType = fetchItemType;
const addItemTypeService = async (data) => {
    return await (0, itemtypeRepository_1.createItemtype)(data);
};
exports.addItemTypeService = addItemTypeService;
const updateItemTypeService = async (id, data) => {
    return await (0, itemtypeRepository_1.updateItemtypeById)(id, data);
};
exports.updateItemTypeService = updateItemTypeService;
const deleteItemTypeService = async (id) => {
    return await (0, itemtypeRepository_1.deleteItemtypeById)(id);
};
exports.deleteItemTypeService = deleteItemTypeService;
const searchItemTypeService = async (keyword) => {
    return await (0, itemtypeRepository_1.searchItemtypeByKeyword)(keyword);
};
exports.searchItemTypeService = searchItemTypeService;
