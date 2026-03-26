import { poolPromise } from "../config/db";
import sql from "mssql";

export const getAllCost = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM ChiPhi");

  return result.recordset;
};

export const createCost = async (data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("HopDongID", data.HopDongID)
    .input("ContainerID", data.ContainerID)
    .input("LoaiChiPhi", data.LoaiChiPhi)
    .input("SoTien", data.SoTien)
    .input("ThuKhachHang", data.ThuKhachHang)
    .query(`
      INSERT INTO ChiPhi 
      (HopDongID, ContainerID, LoaiChiPhi, SoTien, ThuKhachHang)
      VALUES (@HopDongID, @ContainerID, @LoaiChiPhi, @SoTien, @ThuKhachHang)
    `);
};

export const updateCostById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .input("HopDongID", data.HopDongID)
    .input("ContainerID", data.ContainerID)
    .input("LoaiChiPhi", data.LoaiChiPhi)
    .input("SoTien", data.SoTien)
    .input("ThuKhachHang", data.ThuKhachHang)
    .query(`
      UPDATE ChiPhi SET
        HopDongID = @HopDongID,
        ContainerID = @ContainerID,
        LoaiChiPhi = @LoaiChiPhi,
        SoTien = @SoTien,
        ThuKhachHang = @ThuKhachHang
      WHERE ChiPhiID = @ChiPhiID
    `);
};

export const deleteCostById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .query("DELETE FROM ChiPhi WHERE ChiPhiID = @ChiPhiID");
};

export const searchCostByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
  const request = pool.request();
  const term = searchTerm?.trim();

  let query = `
    SELECT 
      cp.*,
      'CP' + RIGHT('000' + CAST(cp.ChiPhiID AS VARCHAR(3)), 3) AS FormattedID,
      kh.TenKH,
      c.ContainerID
    FROM ChiPhi cp
    LEFT JOIN HopDong hd ON cp.HopDongID = hd.HopDongID
    LEFT JOIN KhachHang kh ON hd.KhachHangID = kh.KhachHangID
    LEFT JOIN Container c ON cp.ContainerID = c.ContainerID
  `;

  if (term) {
    query += `
      WHERE 
        ('CP' + RIGHT('000' + CAST(cp.ChiPhiID AS VARCHAR(3)), 3)) LIKE @search
        OR cp.LoaiChiPhi LIKE @search
        OR cp.ThuKhachHang LIKE @search
        OR kh.TenKH LIKE @search
        OR CAST(cp.SoTien AS VARCHAR(20)) LIKE @search
    `;
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY cp.ChiPhiID DESC";

  const result = await request.query(query);
  return result.recordset;
};