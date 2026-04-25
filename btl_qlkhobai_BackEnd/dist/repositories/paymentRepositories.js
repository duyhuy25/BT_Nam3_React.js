"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentById = exports.createPayment = exports.getPaymentsByInvoiceId = void 0;
const db_1 = require("../config/db");
const getPaymentsByInvoiceId = async (hoaDonId) => {
    const pool = await db_1.poolPromise;
    const result = await pool.request()
        .input("HoaDonID", hoaDonId)
        .query(`
      SELECT * FROM ThanhToan 
      WHERE HoaDonID = @HoaDonID 
      ORDER BY ThoiGian DESC
    `);
    return result.recordset;
};
exports.getPaymentsByInvoiceId = getPaymentsByInvoiceId;
const createPayment = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HoaDonID", data.HoaDonID)
        .input("SoTien", data.SoTien)
        .input("PhuongThuc", data.PhuongThuc)
        .input("ThoiGian", data.ThoiGian || new Date())
        .query(`
      INSERT INTO ThanhToan (HoaDonID, SoTien, PhuongThuc, ThoiGian)
      VALUES (@HoaDonID, @SoTien, @PhuongThuc, @ThoiGian)
    `);
};
exports.createPayment = createPayment;
const deletePaymentById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ThanhToanID", id)
        .query("DELETE FROM ThanhToan WHERE ThanhToanID = @ThanhToanID");
};
exports.deletePaymentById = deletePaymentById;
