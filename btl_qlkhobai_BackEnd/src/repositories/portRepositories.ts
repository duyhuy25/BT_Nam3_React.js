import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllPort = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      c.*,
      'CNG' + RIGHT('000' + CAST(c.CangID AS VARCHAR(3)), 3) AS FormattedID
    FROM Cang c
    ORDER BY c.CangID ASC
  `);

  return result.recordset;
};

export const createPort = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("TenCang", data.TenCang)
    .input("MaCang", data.MaCang)
    .input("ViTri", data.ViTri)
    .query(`
      INSERT INTO Cang (TenCang, MaCang, ViTri)
      VALUES (@TenCang, @MaCang, @ViTri)
    `);
};

export const updatePortById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("CangID", id)
    .input("TenCang", data.TenCang)
    .input("MaCang", data.MaCang)
    .input("ViTri", data.ViTri)
    .query(`
      UPDATE Cang SET
        TenCang = @TenCang,
        MaCang = @MaCang,
        ViTri = @ViTri
      WHERE CangID = @CangID
    `);
};


export const deletePortById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("CangID", id)
    .query("DELETE FROM Cang WHERE CangID = @CangID");
};

export const searchPortByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      c.*,
      'CNG' + RIGHT('000' + CAST(c.CangID AS VARCHAR(3)), 3) AS FormattedID
    FROM Cang c
  `;

  if (term) {
    query += `
      WHERE 
        ('CNG' + RIGHT('000' + CAST(c.CangID AS VARCHAR(3)), 3)) LIKE @search
        OR c.TenCang LIKE @search
        OR c.MaCang LIKE @search
        OR c.ViTri LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY c.CangID DESC";

  const result = await request.query(query);
  return result.recordset;
};