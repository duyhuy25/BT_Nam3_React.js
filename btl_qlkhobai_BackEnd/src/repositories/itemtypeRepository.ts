import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllItemtype = async () => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT 
      lh.*,
      'LH' + RIGHT('000' + CAST(lh.LoaiHangID AS VARCHAR(3)), 3) AS FormattedID
    FROM LoaiHang lh
    ORDER BY lh.LoaiHangID ASC
  `);

  return result.recordset;
};

export const createItemtype = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("TenLoai", data.TenLoai)
    .input("MoTa", data.MoTa)
    .input("DanhMuc", data.DanhMuc)
    .query(`
      INSERT INTO LoaiHang (TenLoai, MoTa, DanhMuc)
      VALUES (@TenLoai, @MoTa, @DanhMuc)
    `);
};

export const updateItemtypeById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("LoaiHangID", id)
    .input("TenLoai", data.TenLoai)
    .input("MoTa", data.MoTa)
    .input("DanhMuc", data.DanhMuc)
    .query(`
      UPDATE LoaiHang SET
        TenLoai = @TenLoai,
        MoTa = @MoTa,
        DanhMuc = @DanhMuc
      WHERE LoaiHangID = @LoaiHangID
    `);
};

export const deleteItemtypeById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("LoaiHangID", id)
    .query("DELETE FROM LoaiHang WHERE LoaiHangID = @LoaiHangID");
};

export const searchItemtypeByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      lh.*,
      'LH' + RIGHT('000' + CAST(lh.LoaiHangID AS VARCHAR(3)), 3) AS FormattedID
    FROM LoaiHang lh
  `;

  if (term) {
    query += `
      WHERE 
        ('LH' + RIGHT('000' + CAST(lh.LoaiHangID AS VARCHAR(3)), 3)) LIKE @search
        OR lh.TenLoai LIKE @search
        OR lh.DanhMuc LIKE @search
        OR lh.MoTa LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY lh.LoaiHangID DESC";

  const result = await request.query(query);
  return result.recordset;
};