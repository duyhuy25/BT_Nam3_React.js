import { poolPromise } from "../config/db";
import sql from "mssql";


export const getAllCustomer = async () => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .query("SELECT * FROM KhachHang");

  return result.recordset;
};

export const createCustomer = async (data: any) => {
  const pool = await poolPromise;

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

export const updateCustomerById = async (id: number, data: any) => {
  const pool = await poolPromise;

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

export const deleteCustomerById = async (id: number) => {
  const pool = await poolPromise;

  await pool.request()
    .input("KhachHangID", id)
    .query("DELETE FROM KhachHang WHERE KhachHangID = @KhachHangID");
};

export const searchCustomerByKeyword = async (searchTerm = "") => {
  const pool = await poolPromise;
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
    request.input("search", sql.NVarChar(100), `%${term}%`);
  }

  query += " ORDER BY k.KhachHangID DESC";

  const result = await request.query(query);
  return result.recordset;
};