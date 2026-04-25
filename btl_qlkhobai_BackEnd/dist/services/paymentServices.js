"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePaymentService = exports.addPaymentService = exports.fetchPaymentsByInvoiceIdService = void 0;
const paymentRepositories_1 = require("../repositories/paymentRepositories");
const fetchPaymentsByInvoiceIdService = async (hoaDonId) => {
    return await (0, paymentRepositories_1.getPaymentsByInvoiceId)(hoaDonId);
};
exports.fetchPaymentsByInvoiceIdService = fetchPaymentsByInvoiceIdService;
const addPaymentService = async (data) => {
    return await (0, paymentRepositories_1.createPayment)(data);
};
exports.addPaymentService = addPaymentService;
const removePaymentService = async (id) => {
    return await (0, paymentRepositories_1.deletePaymentById)(id);
};
exports.removePaymentService = removePaymentService;
