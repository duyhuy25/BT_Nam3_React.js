import { pool } from "../config/db";

export const getAllHistory = async () => {

  const db = await pool;

  const result = await db.request().query(`
    SELECT 
        LichSuID,
        ContainerID,
        HoatDong,
        ThoiGian,
        ViTri
    FROM LichSuContainer
    ORDER BY ThoiGian DESC
  `);

  return result.recordset;
};