"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHistory = exports.deleteHistory = exports.updateHistory = exports.createHistory = exports.getAllContainerHistory = void 0;
const db_1 = require("../config/db");
const mssql_1 = __importDefault(require("mssql"));
const getAllContainerHistory = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      ls.*,
      'CTN' + RIGHT('000' + CAST(ls.ContainerID AS VARCHAR(3)), 3) AS MaContainer
    FROM LichSuContainer ls
    ORDER BY ls.ThoiGian DESC
  `);
    return result.recordset;
};
exports.getAllContainerHistory = getAllContainerHistory;
const createHistory = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ContainerID", mssql_1.default.Int, data.ContainerID)
        .input("ThoiGian", mssql_1.default.DateTime, data.ThoiGian || new Date())
        .input("HoatDong", mssql_1.default.NVarChar, data.HoatDong)
        .input("ViTri", mssql_1.default.NVarChar, data.ViTri)
        .query(`
      INSERT INTO LichSuContainer (ContainerID, ThoiGian, HoatDong, ViTri)
      VALUES (@ContainerID, @ThoiGian, @HoatDong, @ViTri)
    `);
};
exports.createHistory = createHistory;
const updateHistory = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("LichSuID", mssql_1.default.Int, id)
        .input("ContainerID", mssql_1.default.Int, data.ContainerID)
        .input("ThoiGian", mssql_1.default.DateTime, data.ThoiGian)
        .input("HoatDong", mssql_1.default.NVarChar, data.HoatDong)
        .input("ViTri", mssql_1.default.NVarChar, data.ViTri)
        .query(`
      UPDATE LichSuContainer
      SET ContainerID = @ContainerID,
          ThoiGian = @ThoiGian,
          HoatDong = @HoatDong,
          ViTri = @ViTri
      WHERE LichSuID = @LichSuID
    `);
};
exports.updateHistory = updateHistory;
const deleteHistory = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("LichSuID", mssql_1.default.Int, id)
        .query("DELETE FROM LichSuContainer WHERE LichSuID = @LichSuID");
};
exports.deleteHistory = deleteHistory;
const searchHistory = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      ls.*,
      'CTN' + RIGHT('000' + CAST(ls.ContainerID AS VARCHAR(3)), 3) AS MaContainer
    FROM LichSuContainer ls
  `;
    if (term) {
        query += `
      WHERE 
        ls.HoatDong LIKE @search
        OR ls.ViTri LIKE @search
        OR ('CTN' + RIGHT('000' + CAST(ls.ContainerID AS VARCHAR(3)), 3)) LIKE @search
        OR CONVERT(VARCHAR, ls.ThoiGian, 120) LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY ls.ThoiGian ASC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchHistory = searchHistory;
