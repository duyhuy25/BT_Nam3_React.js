import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllContainer = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM Container");

  return result.recordset;
};

export const createContainer = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("LoaiHangID", sql.Int, data.LoaiHangID)
    .input("TrongLuong", sql.Decimal(10, 2), data.TrongLuong)
    .input("TrangThai", sql.NVarChar, data.TrangThai || "Rỗng")
    .input("KhoID", sql.Int, data.KhoID)
    .input("PhuongTienID", sql.Int, data.PhuongTienID)
    .query(`
      INSERT INTO Container (HopDongID, LoaiHangID, TrongLuong, TrangThai, KhoID, PhuongTienID)
      VALUES (@HopDongID, @LoaiHangID, @TrongLuong, @TrangThai, @KhoID, @PhuongTienID)
    `);
};

export const updateContainer = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ContainerID", sql.Int, id)
    .input("HopDongID", sql.Int, data.HopDongID)
    .input("LoaiHangID", sql.Int, data.LoaiHangID)
    .input("TrongLuong", sql.Decimal(10, 2), data.TrongLuong)
    .input("TrangThai", sql.NVarChar, data.TrangThai)
    .input("KhoID", sql.Int, data.KhoID)
    .input("PhuongTienID", sql.Int, data.PhuongTienID)
    .query(`
      UPDATE Container
      SET HopDongID = @HopDongID,
          LoaiHangID = @LoaiHangID,
          TrongLuong = @TrongLuong,
          TrangThai = @TrangThai,
          KhoID = @KhoID,
          PhuongTienID = @PhuongTienID
      WHERE ContainerID = @ContainerID
    `);
};

export const deleteContainer = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ContainerID", sql.Int, id)
    .query("DELETE FROM Container WHERE ContainerID = @ContainerID");
};