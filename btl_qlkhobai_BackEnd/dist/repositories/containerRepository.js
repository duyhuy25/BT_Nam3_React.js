"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContainer = exports.deleteContainer = exports.updateContainer = exports.createContainer = exports.getAllContainer = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const getAllContainer = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool
        .request()
        .query("SELECT * FROM Container");
    return result.recordset;
};
exports.getAllContainer = getAllContainer;
const createContainer = async (data) => {
    const pool = await db_1.poolPromise;
    const result = await pool.request()
        .input("HopDongID", mssql_1.default.Int, data.HopDongID)
        .input("LoaiHangID", mssql_1.default.Int, data.LoaiHangID)
        .input("TrongLuong", mssql_1.default.Decimal(10, 2), data.TrongLuong)
        .input("TrangThai", mssql_1.default.NVarChar, data.TrangThai || "Rỗng")
        .input("KhoID", mssql_1.default.Int, data.KhoID || null)
        .input("PhuongTienID", mssql_1.default.Int, data.PhuongTienID || null)
        .query(`
      INSERT INTO Container (HopDongID, LoaiHangID, TrongLuong, TrangThai, KhoID, PhuongTienID)
      OUTPUT INSERTED.ContainerID
      VALUES (@HopDongID, @LoaiHangID, @TrongLuong, @TrangThai, @KhoID, @PhuongTienID)
    `);
    return result;
};
exports.createContainer = createContainer;
const updateContainer = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ContainerID", mssql_1.default.Int, id)
        .input("HopDongID", mssql_1.default.Int, data.HopDongID)
        .input("LoaiHangID", mssql_1.default.Int, data.LoaiHangID)
        .input("TrongLuong", mssql_1.default.Decimal(10, 2), data.TrongLuong)
        .input("TrangThai", mssql_1.default.NVarChar, data.TrangThai)
        .input("KhoID", mssql_1.default.Int, data.KhoID || null)
        .input("PhuongTienID", mssql_1.default.Int, data.PhuongTienID || null)
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
exports.updateContainer = updateContainer;
const deleteContainer = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ContainerID", mssql_1.default.Int, id)
        .query("DELETE FROM Container WHERE ContainerID = @ContainerID");
};
exports.deleteContainer = deleteContainer;
const searchContainer = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      c.*,
      'CTN' + RIGHT('000' + CAST(c.ContainerID AS VARCHAR(3)), 3) AS FormattedID,
      lh.TenLoai, k.TenKho, pt.BienSo, kh.TenKH
    FROM Container c
    LEFT JOIN LoaiHang lh ON c.LoaiHangID = lh.LoaiHangID
    LEFT JOIN KhoLT k ON c.KhoID = k.KhoID
    LEFT JOIN PhuongTien pt ON c.PhuongTienID = pt.PhuongTienID
    LEFT JOIN HopDong hd ON c.HopDongID = hd.HopDongID
    LEFT JOIN KhachHang kh ON hd.KhachHangID = kh.KhachHangID
  `;
    if (term) {
        query += `
      WHERE 
        ('CTN' + RIGHT('000' + CAST(c.ContainerID AS VARCHAR(3)), 3)) LIKE @search 
        OR c.TrangThai LIKE @search
        OR lh.TenLoai LIKE @search
        OR k.TenKho LIKE @search
        OR pt.BienSo LIKE @search
        OR kh.TenKH LIKE @search
        OR ('HD' + RIGHT('000' + CAST(c.HopDongID AS VARCHAR(3)), 3)) LIKE @search
        OR CAST(c.HopDongID AS VARCHAR(10)) LIKE @search
        OR CAST(c.TrongLuong AS VARCHAR(20)) LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY c.ContainerID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchContainer = searchContainer;
