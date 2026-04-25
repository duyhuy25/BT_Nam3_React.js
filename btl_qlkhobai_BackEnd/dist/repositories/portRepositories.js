"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPortByKeyword = exports.deletePortById = exports.updatePortById = exports.createPort = exports.getAllPort = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllPort = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      c.*,
      'CNG' + RIGHT('000' + CAST(c.CangID AS VARCHAR(3)), 3) AS FormattedID
    FROM Cang c
    ORDER BY c.CangID ASC
  `);
    return result.recordset;
};
exports.getAllPort = getAllPort;
const createPort = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("TenCang", data.TenCang)
        .input("MaCang", data.MaCang)
        .input("ViTri", data.ViTri)
        .query(`
      INSERT INTO Cang (TenCang, MaCang, ViTri)
      VALUES (@TenCang, @MaCang, @ViTri)
    `);
};
exports.createPort = createPort;
const updatePortById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("CangID", id)
        .input("TenCang", data.TenCang)
        .input("MaCang", data.MaCang)
        .input("ViTri", data.ViTri)
        .query(`
      UPDATE Cang SET
        TenCang = @TenCang,
        MaCang = @MaCang,
        ViTri = @ViTri
      WHERE CangID = @CangID
    `);
};
exports.updatePortById = updatePortById;
const deletePortById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("CangID", id)
        .query("DELETE FROM Cang WHERE CangID = @CangID");
};
exports.deletePortById = deletePortById;
const searchPortByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      c.*,
      'CNG' + RIGHT('000' + CAST(c.CangID AS VARCHAR(3)), 3) AS FormattedID
    FROM Cang c
  `;
    if (term) {
        query += `
      WHERE 
        ('CNG' + RIGHT('000' + CAST(c.CangID AS VARCHAR(3)), 3)) LIKE @search
        OR c.TenCang LIKE @search
        OR c.MaCang LIKE @search
        OR c.ViTri LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY c.CangID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchPortByKeyword = searchPortByKeyword;
