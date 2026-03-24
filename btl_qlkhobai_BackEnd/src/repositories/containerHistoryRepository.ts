import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllContainerHistory = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      ls.*,
      'CTN' + RIGHT('000' + CAST(ls.ContainerID AS VARCHAR(3)), 3) AS MaContainer
    FROM LichSuContainer ls
    ORDER BY ls.ThoiGian DESC
  `);

  return result.recordset;
};

export const createHistory = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ContainerID", sql.Int, data.ContainerID)
    .input("ThoiGian", sql.DateTime, data.ThoiGian || new Date())
    .input("HoatDong", sql.NVarChar, data.HoatDong)
    .input("ViTri", sql.NVarChar, data.ViTri)
    .query(`
      INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, ViTri)
      VALUES (@ContainerID, @ThoiGian, @HoatDong, @ViTri)
    `);
};

export const updateHistory = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("LichSuID", sql.Int, id)
    .input("ContainerID", sql.Int, data.ContainerID)
    .input("ThoiGian", sql.DateTime, data.ThoiGian)
    .input("HoatDong", sql.NVarChar, data.HoatDong)
    .input("ViTri", sql.NVarChar, data.ViTri)
    .query(`
      UPDATE LichSuContainer
      SET ContainerID = @ContainerID,
          ThoiGian = @ThoiGian,
          HoatDong = @HoatDong,
          ViTri = @ViTri
      WHERE LichSuID = @LichSuID
    `);
};

export const deleteHistory = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("LichSuID", sql.Int, id)
    .query("DELETE FROM LichSuContainer WHERE LichSuID = @LichSuID");
};

export const searchHistory = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      ls.*,
      'CTN' + RIGHT('000' + CAST(ls.ContainerID AS VARCHAR(3)), 3) AS MaContainer
    FROM LichSuContainer ls
  `;

  if (term) {
    query += `
      WHERE 
        ls.HoatDong LIKE @search
        OR ls.ViTri LIKE @search
        OR ('CTN' + RIGHT('000' + CAST(ls.ContainerID AS VARCHAR(3)), 3)) LIKE @search
        OR CONVERT(VARCHAR, ls.ThoiGian, 120) LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY ls.ThoiGian DESC";

  const result = await request.query(query);
  return result.recordset;
};