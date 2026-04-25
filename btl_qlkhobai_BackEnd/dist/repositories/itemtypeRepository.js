"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchItemtypeByKeyword = exports.deleteItemtypeById = exports.updateItemtypeById = exports.createItemtype = exports.getAllItemtype = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllItemtype = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      lh.*,
      'LH' + RIGHT('000' + CAST(lh.LoaiHangID AS VARCHAR(3)), 3) AS FormattedID
    FROM LoaiHang lh
    ORDER BY lh.LoaiHangID ASC
  `);
    return result.recordset;
};
exports.getAllItemtype = getAllItemtype;
const createItemtype = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("TenLoai", data.TenLoai)
        .input("MoTa", data.MoTa)
        .input("DanhMuc", data.DanhMuc)
        .query(`
      INSERT INTO LoaiHang (TenLoai, MoTa, DanhMuc)
      VALUES (@TenLoai, @MoTa, @DanhMuc)
    `);
};
exports.createItemtype = createItemtype;
const updateItemtypeById = async (id, data) => {
    const pool = await db_1.poolPromise;
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
exports.updateItemtypeById = updateItemtypeById;
const deleteItemtypeById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("LoaiHangID", id)
        .query("DELETE FROM LoaiHang WHERE LoaiHangID = @LoaiHangID");
};
exports.deleteItemtypeById = deleteItemtypeById;
const searchItemtypeByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
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
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY lh.LoaiHangID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchItemtypeByKeyword = searchItemtypeByKeyword;
