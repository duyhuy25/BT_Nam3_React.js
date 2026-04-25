"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCustomerService = exports.deleteCustomerService = exports.updateCustomerService = exports.addCustomerService = exports.fetchCustomer = void 0;
const customerRepositories_1 = require("../repositories/customerRepositories");
const fetchCustomer = async () => {
    return await (0, customerRepositories_1.getAllCustomer)();
};
exports.fetchCustomer = fetchCustomer;
const addCustomerService = async (data) => {
    return await (0, customerRepositories_1.createCustomer)(data);
};
exports.addCustomerService = addCustomerService;
const updateCustomerService = async (id, data) => {
    return await (0, customerRepositories_1.updateCustomerById)(id, data);
};
exports.updateCustomerService = updateCustomerService;
const deleteCustomerService = async (id) => {
    return await (0, customerRepositories_1.deleteCustomerById)(id);
};
exports.deleteCustomerService = deleteCustomerService;
const searchCustomerService = async (keyword) => {
    return await (0, customerRepositories_1.searchCustomerByKeyword)(keyword);
};
exports.searchCustomerService = searchCustomerService;
