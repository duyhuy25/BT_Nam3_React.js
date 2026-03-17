import React, { useEffect, useState } from "react";
import "./Pages.css";

interface ItemType {
  LoaiHangID: number;
  TenLoai: string;
  DanhMuc: string;
  MoTa: string;
}

const ItemTypes = () => {

  const [types, setTypes] = useState<ItemType[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/itemtype/itemtype")
      .then(res => res.json())
      .then(data => setTypes(data));
  }, []);

  const filtered = types.filter(t =>
    t.TenLoai.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h2>📂 Loại hàng</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm loại hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add">+ Thêm loại hàng</button>

        </div>
      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Tên loại hàng</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(t => (

            <tr key={t.LoaiHangID}>
              <td>{t.LoaiHangID}</td>
              <td>{t.TenLoai}</td>
              <td>{t.DanhMuc}</td>
              <td>{t.MoTa}</td>

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

export default ItemTypes;