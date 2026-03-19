import { poolPromise } from "../config/db";

export const getAllCost = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM ChiPhi");

  return result.recordset;
};