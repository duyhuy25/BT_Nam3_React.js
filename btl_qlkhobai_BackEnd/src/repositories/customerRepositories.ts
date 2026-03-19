import { poolPromise } from "../config/db";

export const getAllCustomer = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM KhachHang");

  return result.recordset;
};