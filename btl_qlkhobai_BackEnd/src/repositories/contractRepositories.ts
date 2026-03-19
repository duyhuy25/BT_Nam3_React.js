import { poolPromise } from "../config/db";

export const getAllContract = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM HopDong");

  return result.recordset;
};