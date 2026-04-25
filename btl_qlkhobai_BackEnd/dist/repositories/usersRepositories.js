"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUserByKeyword = exports.deleteUserById = exports.updateUserById = exports.createUser = exports.getAllUser = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllUser = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      u.UserID,
      u.Username,
      u.HoTen,
      u.Email,
      u.TrangThai,
      v.TenVaiTro
    FROM Users u
    LEFT JOIN VaiTro v ON u.RoleID = v.RoleID
    ORDER BY u.UserID ASC
  `);
    return result.recordset;
};
exports.getAllUser = getAllUser;
const createUser = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("Username", mssql_1.default.NVarChar(50), data.Username)
        .input("PasswordHash", mssql_1.default.NVarChar(255), data.PasswordHash)
        .input("HoTen", mssql_1.default.NVarChar(100), data.HoTen)
        .input("Email", mssql_1.default.NVarChar(100), data.Email)
        .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai || "Hoạt động")
        .input("RoleID", mssql_1.default.Int, data.RoleID)
        .query(`
      INSERT INTO Users 
      (Username, PasswordHash, HoTen, Email, TrangThai, RoleID)
      VALUES 
      (@Username, @PasswordHash, @HoTen, @Email, @TrangThai, @RoleID)
    `);
};
exports.createUser = createUser;
const updateUserById = async (id, data) => {
    const pool = await db_1.poolPromise;
    const roleId = data.RoleID ? Number(data.RoleID) : 1;
    await pool.request()
        .input("UserID", mssql_1.default.Int, id)
        .input("Username", mssql_1.default.NVarChar(50), data.Username)
        .input("HoTen", mssql_1.default.NVarChar(100), data.HoTen)
        .input("Email", mssql_1.default.NVarChar(100), data.Email)
        .input("TrangThai", mssql_1.default.NVarChar(50), data.TrangThai || "Hoạt động")
        .input("RoleID", mssql_1.default.Int, roleId)
        .query(`
      UPDATE Users 
      SET 
        Username = @Username,
        HoTen = @HoTen,
        Email = @Email,
        TrangThai = @TrangThai,
        RoleID = @RoleID
      WHERE UserID = @UserID
    `);
};
exports.updateUserById = updateUserById;
const deleteUserById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("UserID", mssql_1.default.Int, id)
        .query(`DELETE FROM Users WHERE UserID = @UserID`);
};
exports.deleteUserById = deleteUserById;
const searchUserByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm.trim();
    let query = `
    SELECT 
      u.UserID,
      u.Username,
      u.HoTen,
      u.Email,
      u.TrangThai,
      v.TenVaiTro
    FROM Users u
    LEFT JOIN VaiTro v ON u.RoleID = v.RoleID
  `;
    if (term) {
        query += `
      WHERE 
        u.Username LIKE @search
        OR u.HoTen LIKE @search
        OR u.Email LIKE @search
        OR v.TenVaiTro LIKE @search
        OR u.TrangThai LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY u.UserID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchUserByKeyword = searchUserByKeyword;
