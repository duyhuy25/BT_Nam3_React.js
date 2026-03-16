import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Vehicle {
  PhuongTienID: number;
  LoaiXe: string;
  BienSo: string;
  TaiTrong: number;
  TrangThai: string;
}

const Vehicles = () => {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles")
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
            <th>Tải trọng</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(v => (

            <tr key={v.PhuongTienID}>
              <td>{v.PhuongTienID}</td>
              <td>{v.LoaiXe}</td>
              <td>{v.BienSo}</td>
              <td>{v.TaiTrong}</td>
              <td>{v.TrangThai}</td>

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