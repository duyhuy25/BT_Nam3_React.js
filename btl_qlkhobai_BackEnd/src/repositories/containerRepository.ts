import { poolPromise } from "../config/db";

export const getAllContainer = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM Container");

  return result.recordset;
};