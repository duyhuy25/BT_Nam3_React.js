"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCustomerByKeyword = exports.deleteCustomerById = exports.updateCustomerById = exports.createCustomer = exports.getAllCustomer = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const getAllCustomer = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool
        .request()
        .query("SELECT * FROM KhachHang");
    return result.recordset;
};
exports.getAllCustomer = getAllCustomer;
const createCustomer = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("TenKH", data.TenKH)
        .input("DiaChi", data.DiaChi)
        .input("SDT", data.SDT)
        .input("Email", data.Email)
        .query(`
      INSERT INTO KhachHang (TenKH, DiaChi, SDT, Email)
      VALUES (@TenKH, @DiaChi, @SDT, @Email)
    `);
};
exports.createCustomer = createCustomer;
const updateCustomerById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("KhachHangID", id)
        .input("TenKH", data.TenKH)
        .input("DiaChi", data.DiaChi)
        .input("SDT", data.SDT)
        .input("Email", data.Email)
        .query(`
      UPDATE KhachHang SET
        TenKH = @TenKH,
        DiaChi = @DiaChi,
        SDT = @SDT,
        Email = @Email
      WHERE KhachHangID = @KhachHangID
    `);
};
exports.updateCustomerById = updateCustomerById;
const deleteCustomerById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("KhachHangID", id)
        .query("DELETE FROM KhachHang WHERE KhachHangID = @KhachHangID");
};
exports.deleteCustomerById = deleteCustomerById;
const searchCustomerByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      k.*,
      'KH' + RIGHT('000' + CAST(k.KhachHangID AS VARCHAR(3)), 3) AS FormattedID
    FROM KhachHang k
  `;
    if (term) {
        query += `
      WHERE 
        ('KH' + RIGHT('000' + CAST(k.KhachHangID AS VARCHAR(3)), 3)) LIKE @search
        OR k.TenKH LIKE @search
        OR k.SDT LIKE @search
        OR k.Email LIKE @search
        OR k.DiaChi LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY k.KhachHangID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchCustomerByKeyword = searchCustomerByKeyword;
