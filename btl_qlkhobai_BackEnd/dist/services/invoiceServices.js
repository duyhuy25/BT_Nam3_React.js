"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInvoiceService = exports.deleteInvoiceService = exports.updateInvoiceService = exports.addInvoiceService = exports.fetchInvoice = void 0;
const invoiceRepositories_1 = require("../repositories/invoiceRepositories");
const fetchInvoice = async () => {
    return await (0, invoiceRepositories_1.getAllInvoice)();
};
exports.fetchInvoice = fetchInvoice;
const addInvoiceService = async (data) => {
    return await (0, invoiceRepositories_1.createInvoice)(data);
};
exports.addInvoiceService = addInvoiceService;
const updateInvoiceService = async (id, data) => {
    return await (0, invoiceRepositories_1.updateInvoiceById)(id, data);
};
exports.updateInvoiceService = updateInvoiceService;
const deleteInvoiceService = async (id) => {
    return await (0, invoiceRepositories_1.deleteInvoiceById)(id);
};
exports.deleteInvoiceService = deleteInvoiceService;
const searchInvoiceService = async (keyword) => {
    return await (0, invoiceRepositories_1.searchInvoiceByKeyword)(keyword);
};
exports.searchInvoiceService = searchInvoiceService;
