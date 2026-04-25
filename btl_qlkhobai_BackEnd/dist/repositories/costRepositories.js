"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCostByKeyword = exports.deleteCostById = exports.updateCostById = exports.createCost = exports.getAllCost = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const getAllCost = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool
        .request()
        .query("SELECT * FROM ChiPhi");
    return result.recordset;
};
exports.getAllCost = getAllCost;
const createCost = async (data) => {
    const pool = await db_1.poolPromise;
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
exports.createCost = createCost;
const updateCostById = async (id, data) => {
    const pool = await db_1.poolPromise;
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
exports.updateCostById = updateCostById;
const deleteCostById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ChiPhiID", id)
        .query("DELETE FROM ChiPhi WHERE ChiPhiID = @ChiPhiID");
};
exports.deleteCostById = deleteCostById;
const searchCostByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
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
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY cp.ChiPhiID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchCostByKeyword = searchCostByKeyword;
