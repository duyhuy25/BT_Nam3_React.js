import { poolPromise } from "../config/db";

export const getAllVehicle = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM PhuongTien");

  return result.recordset;
};