"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVehicleByKeyword = exports.deleteVehicleById = exports.updateVehicleById = exports.createVehicle = exports.getAllVehicle = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllVehicle = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT * FROM PhuongTien ORDER BY PhuongTienID DESC
  `);
    return result.recordset;
};
exports.getAllVehicle = getAllVehicle;
const createVehicle = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("LoaiPhuongTien", mssql_1.default.NVarChar(50), data.LoaiPhuongTien)
        .input("BienSo", mssql_1.default.NVarChar(20), data.BienSo)
        .input("HinhAnh", mssql_1.default.NVarChar(255), data.HinhAnh)
        .input("TaiTrong", mssql_1.default.Decimal(10, 2), data.TaiTrong)
        .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai || "Hoạt động")
        .input("MoTa", mssql_1.default.NVarChar(500), data.MoTa)
        .query(`
      INSERT INTO PhuongTien
      (LoaiPhuongTien, BienSo, HinhAnh, TaiTrong, TrangThai, MoTa)
      VALUES
      (@LoaiPhuongTien, @BienSo, @HinhAnh, @TaiTrong, @TrangThai, @MoTa)
    `);
};
exports.createVehicle = createVehicle;
const updateVehicleById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("PhuongTienID", mssql_1.default.Int, id)
        .input("LoaiPhuongTien", mssql_1.default.NVarChar(50), data.LoaiPhuongTien)
        .input("BienSo", mssql_1.default.NVarChar(20), data.BienSo)
        .input("HinhAnh", mssql_1.default.NVarChar(255), data.HinhAnh)
        .input("TaiTrong", mssql_1.default.Decimal(10, 2), data.TaiTrong)
        .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai)
        .input("MoTa", mssql_1.default.NVarChar(500), data.MoTa)
        .query(`
      UPDATE PhuongTien SET
        LoaiPhuongTien = @LoaiPhuongTien,
        BienSo = @BienSo,
        HinhAnh = @HinhAnh,
        TaiTrong = @TaiTrong,
        TrangThai = @TrangThai,
        MoTa = @MoTa
      WHERE PhuongTienID = @PhuongTienID
    `);
};
exports.updateVehicleById = updateVehicleById;
const deleteVehicleById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("PhuongTienID", mssql_1.default.Int, id)
        .query(`DELETE FROM PhuongTien WHERE PhuongTienID = @PhuongTienID`);
};
exports.deleteVehicleById = deleteVehicleById;
const searchVehicleByKeyword = async (keyword) => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    let query = `
    SELECT * FROM PhuongTien
  `;
    if (keyword) {
        query += `
      WHERE 
        LoaiPhuongTien LIKE @search OR
        BienSo LIKE @search OR
        TrangThai LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${keyword}%`);
    }
    query += " ORDER BY PhuongTienID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchVehicleByKeyword = searchVehicleByKeyword;
