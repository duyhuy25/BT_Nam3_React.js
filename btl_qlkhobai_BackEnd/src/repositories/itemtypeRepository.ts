import { poolPromise } from "../config/db";

export const getAllItemtype = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM LoaiHang");

  return result.recordset;
};