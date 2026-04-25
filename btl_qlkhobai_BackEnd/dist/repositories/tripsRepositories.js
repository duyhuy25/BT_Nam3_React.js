"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTripByKeyword = exports.deleteTripById = exports.updateTripById = exports.createTrip = exports.getAllTrip = void 0;
const mssql_1 = __importDefault(require("mssql"));
const db_1 = require("../config/db");
const getAllTrip = async () => {
    const pool = await db_1.poolPromise;
    const result = await pool.request().query(`
    SELECT 
      cd.*,
      'TRP' + RIGHT('000' + CAST(cd.ChuyenDiID AS VARCHAR(3)), 3) AS FormattedID,
      c1.TenCang AS CangDi,
      c2.TenCang AS CangDen,
      pt.BienSo
    FROM ChuyenDi cd
    LEFT JOIN Cang c1 ON cd.CangDiID = c1.CangID
    LEFT JOIN Cang c2 ON cd.CangDenID = c2.CangID
    LEFT JOIN PhuongTien pt ON cd.PhuongTienID = pt.PhuongTienID
    ORDER BY cd.ChuyenDiID DESC
  `);
    return result.recordset;
};
exports.getAllTrip = getAllTrip;
const createTrip = async (data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("MaChuyen", data.MaChuyen)
        .input("CangDiID", data.CangDiID)
        .input("CangDenID", data.CangDenID)
        .input("NgayKhoiHanh", data.NgayKhoiHanh)
        .input("NgayDuKienDen", data.NgayDuKienDen)
        .input("PhuongTienID", data.PhuongTienID)
        .input("TrangThai", data.TrangThai)
        .query(`
      INSERT INTO ChuyenDi 
      (MaChuyen, CangDiID, CangDenID, NgayKhoiHanh, NgayDuKienDen, PhuongTienID, TrangThai)
      VALUES 
      (@MaChuyen, @CangDiID, @CangDenID, @NgayKhoiHanh, @NgayDuKienDen, @PhuongTienID, @TrangThai)
    `);
};
exports.createTrip = createTrip;
const updateTripById = async (id, data) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ChuyenDiID", id)
        .input("MaChuyen", data.MaChuyen)
        .input("CangDiID", data.CangDiID)
        .input("CangDenID", data.CangDenID)
        .input("NgayKhoiHanh", data.NgayKhoiHanh)
        .input("NgayDuKienDen", data.NgayDuKienDen)
        .input("PhuongTienID", data.PhuongTienID)
        .input("TrangThai", data.TrangThai)
        .query(`
      UPDATE ChuyenDi SET
        MaChuyen = @MaChuyen,
        CangDiID = @CangDiID,
        CangDenID = @CangDenID,
        NgayKhoiHanh = @NgayKhoiHanh,
        NgayDuKienDen = @NgayDuKienDen,
        PhuongTienID = @PhuongTienID,
        TrangThai = @TrangThai
      WHERE ChuyenDiID = @ChuyenDiID
    `);
};
exports.updateTripById = updateTripById;
const deleteTripById = async (id) => {
    const pool = await db_1.poolPromise;
    await pool.request()
        .input("ChuyenDiID", id)
        .query("DELETE FROM ChuyenDi WHERE ChuyenDiID = @ChuyenDiID");
};
exports.deleteTripById = deleteTripById;
const searchTripByKeyword = async (searchTerm = "") => {
    const pool = await db_1.poolPromise;
    const request = pool.request();
    const term = searchTerm?.trim();
    let query = `
    SELECT 
      cd.*,
      'TRP' + RIGHT('000' + CAST(cd.ChuyenDiID AS VARCHAR(3)), 3) AS FormattedID,
      c1.TenCang AS CangDi,
      c2.TenCang AS CangDen,
      pt.BienSo
    FROM ChuyenDi cd
    LEFT JOIN Cang c1 ON cd.CangDiID = c1.CangID
    LEFT JOIN Cang c2 ON cd.CangDenID = c2.CangID
    LEFT JOIN PhuongTien pt ON cd.PhuongTienID = pt.PhuongTienID
  `;
    if (term) {
        query += `
      WHERE 
        ('TRP' + RIGHT('000' + CAST(cd.ChuyenDiID AS VARCHAR(3)), 3)) LIKE @search
        OR cd.MaChuyen LIKE @search
        OR c1.TenCang LIKE @search
        OR c2.TenCang LIKE @search
        OR pt.BienSo LIKE @search
        OR cd.TrangThai LIKE @search
    `;
        request.input("search", mssql_1.default.NVarChar(100), `%${term}%`);
    }
    query += " ORDER BY cd.ChuyenDiID DESC";
    const result = await request.query(query);
    return result.recordset;
};
exports.searchTripByKeyword = searchTripByKeyword;
