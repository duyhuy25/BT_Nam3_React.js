"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCustomer = exports.deleteCustomer = exports.updateCustomer = exports.addCustomer = exports.getCustomer = void 0;
const customerServices_1 = require("../services/customerServices");
const getCustomer = async (req, res) => {
    try {
        const data = await (0, customerServices_1.fetchCustomer)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getCustomer = getCustomer;
const addCustomer = async (req, res) => {
    try {
        await (0, customerServices_1.addCustomerService)(req.body);
        res.json({ message: "Thêm khách hàng thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addCustomer = addCustomer;
const updateCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, customerServices_1.updateCustomerService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, customerServices_1.deleteCustomerService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteCustomer = deleteCustomer;
const searchCustomer = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, customerServices_1.searchCustomerService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchCustomer = searchCustomer;
