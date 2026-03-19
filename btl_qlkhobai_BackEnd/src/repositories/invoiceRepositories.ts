import { poolPromise } from "../config/db";

export const getAllInvoice = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM HoaDon");

  return result.recordset;
};