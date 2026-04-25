"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchInvoice = exports.deleteInvoice = exports.updateInvoice = exports.addInvoice = exports.getInvoice = void 0;
const invoiceServices_1 = require("../services/invoiceServices");
const getInvoice = async (req, res) => {
    try {
        const data = await (0, invoiceServices_1.fetchInvoice)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getInvoice = getInvoice;
const addInvoice = async (req, res) => {
    try {
        await (0, invoiceServices_1.addInvoiceService)(req.body);
        res.json({ message: "Thêm hóa đơn thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addInvoice = addInvoice;
const updateInvoice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, invoiceServices_1.updateInvoiceService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateInvoice = updateInvoice;
const deleteInvoice = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await (0, invoiceServices_1.deleteInvoiceService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteInvoice = deleteInvoice;
const searchInvoice = async (req, res) => {
    try {
        const search = req.query.search;
        const data = await (0, invoiceServices_1.searchInvoiceService)(search);
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchInvoice = searchInvoice;
