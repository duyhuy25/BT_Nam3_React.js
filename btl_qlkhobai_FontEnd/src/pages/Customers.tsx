import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Customer {
  KhachHangID: number;
  TenKH: string;
  DiaChi: string;
  SDT: string;
  Email: string;
}

const Customers = () => {

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/customer/customer")
      .then(res => res.json())
      .then(data => setCustomers(data));
  }, []);

  const filtered = customers.filter(c =>
    c.TenKH.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div>

      <div className="header">

        <h2>👥 Khách hàng</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add">+ Thêm khách hàng</button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(c => (

            <tr key={c.KhachHangID}>
              <td>{c.KhachHangID}</td>
              <td>{c.TenKH}</td>
              <td>{c.DiaChi}</td>
              <td>{c.SDT}</td>
              <td>{c.Email}</td>

              <td>
                <button className="btn-edit">Sửa</button>
                <button className="btn-delete">Xóa</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
};

export default Customers;