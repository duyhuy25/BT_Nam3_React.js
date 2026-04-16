import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllWarehouse = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM KhoLT ORDER BY KhoID ASC
  `);
  return result.recordset;
};

export const createWarehouse = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("TenKho", sql.NVarChar(100), data.TenKho)
    .input("SucChua", sql.Int, data.SucChua)
    .input("SoLuongContainer", sql.Int, data.SoLuongContainer || 0)
    .input("DiaChi", sql.NVarChar(200), data.DiaChi)
    .input("NhanVienQuanLy", sql.NVarChar(100), data.NhanVienQuanLy)
    .query(`
      INSERT INTO KhoLT
      (TenKho, SucChua, SoLuongContainer, DiaChi, NhanVienQuanLy)
      VALUES
      (@TenKho, @SucChua, @SoLuongContainer, @DiaChi, @NhanVienQuanLy)
    `);
};

export const updateWarehouseById = async (id: number, data: any) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("KhoID", sql.Int, id)
    .input("TenKho", sql.NVarChar(100), data.TenKho)
    .input("SucChua", sql.Int, data.SucChua)
    .input("SoLuongContainer", sql.Int, data.SoLuongContainer)
    .input("DiaChi", sql.NVarChar(200), data.DiaChi)
    .input("NhanVienQuanLy", sql.NVarChar(100), data.NhanVienQuanLy)
    .query(`
      UPDATE KhoLT SET
        TenKho = @TenKho,
        SucChua = @SucChua,
        SoLuongContainer = @SoLuongContainer,
        DiaChi = @DiaChi,
        NhanVienQuanLy = @NhanVienQuanLy
      WHERE KhoID = @KhoID
    `);

  return result;
};

export const deleteWarehouseById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("KhoID", sql.Int, id)
    .query(`DELETE FROM KhoLT WHERE KhoID = @KhoID`);
};

export const searchWarehouseByKeyword = async (keyword: string) => {
  const pool = await poolPromise;
  const request = pool.request();

  let query = `SELECT * FROM KhoLT`;

  if (keyword) {
    query += `
      WHERE 
        TenKho LIKE @search OR
        DiaChi LIKE @search OR
        NhanVienQuanLy LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${keyword}%`);
  }

  query += " ORDER BY KhoID DESC";

  const result = await request.query(query);
  return result.recordset;
};