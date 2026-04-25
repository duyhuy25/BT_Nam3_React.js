"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePayment = exports.addPayment = exports.getPayments = void 0;
const paymentServices_1 = require("../services/paymentServices");
const getPayments = async (req, res) => {
    try {
        const hoaDonId = Number(req.params.hoaDonId);
        if (!hoaDonId) {
            return res.status(400).json({ message: "Thiếu HoaDonID" });
        }
        const data = await (0, paymentServices_1.fetchPaymentsByInvoiceIdService)(hoaDonId);
        res.json(data);
    }
    catch (error) {
        console.error("Error getPayments:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getPayments = getPayments;
const addPayment = async (req, res) => {
    try {
        await (0, paymentServices_1.addPaymentService)(req.body);
        res.json({ message: "Thêm thanh toán thành công" });
    }
    catch (error) {
        console.error("Error addPayment:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addPayment = addPayment;
const deletePayment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Thiếu ThanhToanID" });
        }
        await (0, paymentServices_1.removePaymentService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error("Error deletePayment:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deletePayment = deletePayment;
