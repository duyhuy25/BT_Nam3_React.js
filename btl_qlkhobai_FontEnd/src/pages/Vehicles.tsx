import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Vehicle {
  PhuongTienID: number;
  LoaiPhuongTien: string;
  BienSo: string;
  HinhAnh: string;
  TaiTrong: number;
  TrangThai: string;
  MoTa: string;
}

const Vehicles = () => {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicle/vehicle")
      .then(res => res.json())
      .then(data => setVehicles(data));
  }, []);

  const filtered = vehicles.filter(v =>
    v.BienSo.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div>

      <div className="header">

        <h2>🚚 Phương tiện</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm phương tiện..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add">+ Thêm phương tiện</button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Loại xe</th>
            <th>Biển số</th>
            <th>Hình ảnh</th>
            <th>Tải trọng</th>
            <th>Trạng thái</th>
            <th>Mô tả</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(v => (

            <tr key={v.PhuongTienID}>
              <td>{v.PhuongTienID}</td>
              <td>{v.LoaiPhuongTien}</td>
              <td>{v.BienSo}</td>
              <td>{v.HinhAnh}</td>
              <td>{v.TaiTrong}</td>
              <td>{v.TrangThai}</td>
              <td>{v.MoTa}</td>

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

export default Vehicles;