"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchWarehouseByKeyword = exports.deleteWarehouseById = exports.updateWarehouseById = exports.createWarehouse = exports.getAllWarehouse = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllWarehouse = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM KhoLT ORDER BY KhoID ASC
  `);
    return result.recordset;
};
exports.getAllWarehouse = getAllWarehouse;
const createWarehouse = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("TenKho", mssql_1.default.NVarChar(100), data.TenKho)
        .input("SucChua", mssql_1.default.Int, data.SucChua)
        .input("SoLuongContainer", mssql_1.default.Int, data.SoLuongContainer || 0)
        .input("DiaChi", mssql_1.default.NVarChar(200), data.DiaChi)
        .input("NhanVienQuanLy", mssql_1.default.NVarChar(100), data.NhanVienQuanLy)
        .query(`
      INSERT INTO KhoLT
      (TenKho, SucChua, SoLuongContainer, DiaChi, NhanVienQuanLy)
      VALUES
      (@TenKho, @SucChua, @SoLuongContainer, @DiaChi, @NhanVienQuanLy)
    `);
};
exports.createWarehouse = createWarehouse;
const updateWarehouseById = async (id, data) => {
    const pool = await db_1.poolPromise;
    const result = await pool.request()
        .input("KhoID", mssql_1.default.Int, id)
        .input("TenKho", mssql_1.default.NVarChar(100), data.TenKho)
        .input("SucChua", mssql_1.default.Int, data.SucChua)
        .input("SoLuongContainer", mssql_1.default.Int, data.SoLuongContainer)
        .input("DiaChi", mssql_1.default.NVarChar(200), data.DiaChi)
        .input("NhanVienQuanLy", mssql_1.default.NVarChar(100), data.NhanVienQuanLy)
        .query(`
      UPDATE KhoLT SET
        TenKho = @TenKho,
        SucChua = @SucChua,
        SoLuongContainer = @SoLuongContainer,
        DiaChi = @DiaChi,
        NhanVienQuanLy = @NhanVienQuanLy
      WHERE KhoID = @KhoID
    `);
    return result;
};
exports.updateWarehouseById = updateWarehouseById;
const deleteWarehouseById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("KhoID", mssql_1.default.Int, id)
        .query(`DELETE FROM KhoLT WHERE KhoID = @KhoID`);
};
exports.deleteWarehouseById = deleteWarehouseById;
const searchWarehouseByKeyword = async (keyword) => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    let query = `SELECT * FROM KhoLT`;
    if (keyword) {
        query += `
      WHERE 
        TenKho LIKE @search OR
        DiaChi LIKE @search OR
        NhanVienQuanLy LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${keyword}%`);
    }
    query += " ORDER BY KhoID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchWarehouseByKeyword = searchWarehouseByKeyword;
