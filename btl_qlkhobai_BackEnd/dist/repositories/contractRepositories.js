"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContractByKeyword = exports.deleteContractById = exports.updateContractById = exports.createContract = exports.getAllContract = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const getAllContract = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query("SELECT * FROM HopDong");
    return result.recordset;
};
exports.getAllContract = getAllContract;
const createContract = async (data) => {
    const pool = await db_1.poolPromise;
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
      OUTPUT INSERTED.HopDongID
      VALUES (@KhachHangID, @NgayKy, @NgayHetHan, @LoaiDichVu, @GiaTri, @TrangThai)
    `);
    return result;
};
exports.createContract = createContract;
const updateContractById = async (id, data) => {
    const pool = await db_1.poolPromise;
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
exports.updateContractById = updateContractById;
const deleteContractById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("HopDongID", id)
        .query("DELETE FROM HopDong WHERE HopDongID = @HopDongID");
};
exports.deleteContractById = deleteContractById;
const searchContractByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
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
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY h.HopDongID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchContractByKeyword = searchContractByKeyword;
