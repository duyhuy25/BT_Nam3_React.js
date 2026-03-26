import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllContract = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query("SELECT * FROM HopDong");
  return result.recordset;
};

export const createContract = async (data: any) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("KhachHangID", data.KhachHangID)
    .input("NgayKy", data.NgayKy)
    .input("NgayHetHan", data.NgayHetHan)
    .input("LoaiDichVu", data.LoaiDichVu)
    .input("GiaTri", data.GiaTri)
    .input("TrangThai", data.TrangThai)
    .query(`
      INSERT INTO HopDong 
      (KhachHangID, NgayKy, NgayHetHan, LoaiDichVu, GiaTri, TrangThai)
      VALUES (@KhachHangID, @NgayKy, @NgayHetHan, @LoaiDichVu, @GiaTri, @TrangThai)
    `);

  return result;
};

export const updateContractById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", id)
    .input("KhachHangID", data.KhachHangID)
    .input("NgayKy", data.NgayKy)
    .input("NgayHetHan", data.NgayHetHan)
    .input("LoaiDichVu", data.LoaiDichVu)
    .input("GiaTri", data.GiaTri)
    .input("TrangThai", data.TrangThai)
    .query(`
      UPDATE HopDong SET
        KhachHangID = @KhachHangID,
        NgayKy = @NgayKy,
        NgayHetHan = @NgayHetHan,
        LoaiDichVu = @LoaiDichVu,
        GiaTri = @GiaTri,
        TrangThai = @TrangThai
      WHERE HopDongID = @HopDongID
    `);
};

export const deleteContractById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", id)
    .query("DELETE FROM HopDong WHERE HopDongID = @HopDongID");
};

export const searchContractByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      h.*,
      kh.TenKH,
      'HD' + RIGHT('000' + CAST(h.HopDongID AS VARCHAR(3)), 3) AS FormattedID
    FROM HopDong h
    LEFT JOIN KhachHang kh ON h.KhachHangID = kh.KhachHangID
  `;

  if (term) {
    query += `
      WHERE 
        ('HD' + RIGHT('000' + CAST(h.HopDongID AS VARCHAR(3)), 3)) LIKE @search
        OR kh.TenKH LIKE @search
        OR h.LoaiDichVu LIKE @search
        OR h.TrangThai LIKE @search
        OR CAST(h.GiaTri AS VARCHAR(20)) LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY h.HopDongID DESC";

  const result = await request.query(query);
  return result.recordset;
};