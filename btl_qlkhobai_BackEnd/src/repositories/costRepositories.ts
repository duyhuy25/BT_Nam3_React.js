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

      -- Đồng bộ vào Hóa đơn
      IF @HopDongID IS NOT NULL
      BEGIN
        UPDATE HoaDon 
        SET SoTien = SoTien + @SoTien 
        WHERE HopDongID = @HopDongID;
      END
    `);
};

export const updateCostById = async (id: number, data: any) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .input("NewHopDongID", data.HopDongID)
    .input("ContainerID", data.ContainerID)
    .input("LoaiChiPhi", data.LoaiChiPhi)
    .input("NewSoTien", data.SoTien)
    .input("ThuKhachHang", data.ThuKhachHang)
    .query(`
      DECLARE @OldHopDongID INT;
      DECLARE @OldSoTien DECIMAL(15,2);
      
      SELECT @OldHopDongID = HopDongID, @OldSoTien = SoTien 
      FROM ChiPhi WHERE ChiPhiID = @ChiPhiID;

      -- Trừ khoản cũ
      IF @OldHopDongID IS NOT NULL
      BEGIN
        UPDATE HoaDon SET SoTien = SoTien - @OldSoTien WHERE HopDongID = @OldHopDongID;
      END

      -- Cập nhật bản ghi
      UPDATE ChiPhi SET
        HopDongID = @NewHopDongID,
        ContainerID = @ContainerID,
        LoaiChiPhi = @LoaiChiPhi,
        SoTien = @NewSoTien,
        ThuKhachHang = @ThuKhachHang
      WHERE ChiPhiID = @ChiPhiID;

      -- Cộng khoản mới
      IF @NewHopDongID IS NOT NULL
      BEGIN
        UPDATE HoaDon SET SoTien = SoTien + @NewSoTien WHERE HopDongID = @NewHopDongID;
      END
    `);
};

export const deleteCostById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("ChiPhiID", id)
    .query(`
      DECLARE @OldHopDongID INT;
      DECLARE @OldSoTien DECIMAL(15,2);
      
      SELECT @OldHopDongID = HopDongID, @OldSoTien = SoTien 
      FROM ChiPhi WHERE ChiPhiID = @ChiPhiID;

      DELETE FROM ChiPhi WHERE ChiPhiID = @ChiPhiID;

      IF @OldHopDongID IS NOT NULL
      BEGIN
        UPDATE HoaDon SET SoTien = SoTien - @OldSoTien WHERE HopDongID = @OldHopDongID;
      END
    `);
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