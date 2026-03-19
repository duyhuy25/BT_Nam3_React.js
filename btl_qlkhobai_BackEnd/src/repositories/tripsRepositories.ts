import { poolPromise } from "../config/db";

export const getAllTrip = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM ChuyenDi");

  return result.recordset;
};