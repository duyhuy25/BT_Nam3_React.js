import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Warehouse {
  KhoID: number;
  TenKho: string;
  SucChua: number;
  ViTri: string;
  NguoiQuanLy: string;
}

const Warehouses = () => {

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/warehouses")
      .then(res => res.json())
      .then(data => setWarehouses(data));
  }, []);

  const filtered = warehouses.filter(w =>
    w.TenKho.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div className="header">

        <h2>🏭 Kho lưu trữ</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm kho..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add">+ Thêm kho</button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Tên kho</th>
            <th>Sức chứa</th>
            <th>Vị trí</th>
            <th>Quản lý</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(w => (

            <tr key={w.KhoID}>
              <td>{w.KhoID}</td>
              <td>{w.TenKho}</td>
              <td>{w.SucChua}</td>
              <td>{w.ViTri}</td>
              <td>{w.NguoiQuanLy}</td>

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

export default Warehouses;