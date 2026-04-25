import sql from "mssql";
import { poolPromise } from "../config/db";

export const getPaymentsByInvoiceId = async (hoaDonId: number) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input("HoaDonID", sql.Int, hoaDonId)
    .query(`
      SELECT * FROM ThanhToan 
      WHERE HoaDonID = @HoaDonID 
      ORDER BY ThoiGian DESC
    `);
  return result.recordset;
};

export const createPayment = async (data: any) => {
  const pool = await poolPromise;
  await pool.request()
    .input("HoaDonID", sql.Int, data.HoaDonID)
    .input("SoTien", sql.Decimal(15,2), data.SoTien)
    .input("PhuongThuc", sql.NVarChar(50), data.PhuongThuc)
    .input("ThoiGian", sql.DateTime, data.ThoiGian ? new Date(data.ThoiGian) : new Date())
    .query(`
      INSERT INTO ThanhToan (HoaDonID, SoTien, PhuongThuc, ThoiGian)
      VALUES (@HoaDonID, @SoTien, @PhuongThuc, @ThoiGian)
    `);
};

export const deletePaymentById = async (id: number) => {
  const pool = await poolPromise;
  await pool.request()
    .input("ThanhToanID", sql.Int, id)
    .query("DELETE FROM ThanhToan WHERE ThanhToanID = @ThanhToanID");
};
