import sql from "mssql";
import { poolPromise } from "../config/db";

export const getAllVehicle = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM PhuongTien ORDER BY PhuongTienID DESC
  `);
  return result.recordset;
};

export const createVehicle = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("LoaiPhuongTien", sql.NVarChar(50), data.LoaiPhuongTien)
    .input("BienSo", sql.NVarChar(20), data.BienSo)
    .input("HinhAnh", sql.NVarChar(255), data.HinhAnh)
    .input("TaiTrong", sql.Decimal(10,2), data.TaiTrong)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai || "Hoạt động")
    .input("MoTa", sql.NVarChar(500), data.MoTa)
    .query(`
      INSERT INTO PhuongTien
      (LoaiPhuongTien, BienSo, HinhAnh, TaiTrong, TrangThai, MoTa)
      VALUES
      (@LoaiPhuongTien, @BienSo, @HinhAnh, @TaiTrong, @TrangThai, @MoTa)
    `);
};

export const updateVehicleById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("PhuongTienID", sql.Int, id)
    .input("LoaiPhuongTien", sql.NVarChar(50), data.LoaiPhuongTien)
    .input("BienSo", sql.NVarChar(20), data.BienSo)
    .input("HinhAnh", sql.NVarChar(255), data.HinhAnh)
    .input("TaiTrong", sql.Decimal(10,2), data.TaiTrong)
    .input("TrangThai", sql.NVarChar(50), data.TrangThai)
    .input("MoTa", sql.NVarChar(500), data.MoTa)
    .query(`
      UPDATE PhuongTien SET
        LoaiPhuongTien = @LoaiPhuongTien,
        BienSo = @BienSo,
        HinhAnh = @HinhAnh,
        TaiTrong = @TaiTrong,
        TrangThai = @TrangThai,
        MoTa = @MoTa
      WHERE PhuongTienID = @PhuongTienID
    `);
};

export const deleteVehicleById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("PhuongTienID", sql.Int, id)
    .query(`DELETE FROM PhuongTien WHERE PhuongTienID = @PhuongTienID`);
};

export const searchVehicleByKeyword = async (keyword: string) => {
  const pool = await poolPromise;
  const request = pool.request();

  let query = `
    SELECT * FROM PhuongTien
  `;

  if (keyword) {
    query += `
      WHERE 
        LoaiPhuongTien LIKE @search OR
        BienSo LIKE @search OR
        TrangThai LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${keyword}%`);
  }

  query += " ORDER BY PhuongTienID DESC";

  const result = await request.query(query);
  return result.recordset;
};