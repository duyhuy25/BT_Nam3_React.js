import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Trip {
  ChuyenDiID: number;
  MaChuyen: string;
  CangDi: string;
  CangDen: string;
  ETD: string;
  ETA: string;
  PhuongTien: string;
  TrangThai: string;
}

const Trips = () => {

  const [trips,setTrips] = useState<Trip[]>([]);
  const [search,setSearch] = useState("");

  useEffect(()=>{

    fetch("http://localhost:5000/api/trips")
    .then(res=>res.json())
    .then(data=>setTrips(data));

  },[])

  const filtered = trips.filter(t =>
    t.MaChuyen.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div>

      <div className="header">

        <h2>🚢 Chuyến đi</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm chuyến..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <button className="btn-add">
            + Thêm chuyến
          </button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Mã chuyến</th>
            <th>Cảng đi</th>
            <th>Cảng đến</th>
            <th>ETD</th>
            <th>ETA</th>
            <th>Phương tiện</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(t => (

            <tr key={t.ChuyenDiID}>

              <td>{t.ChuyenDiID}</td>
              <td>{t.MaChuyen}</td>
              <td>{t.CangDi}</td>
              <td>{t.CangDen}</td>
              <td>{new Date(t.ETD).toLocaleDateString()}</td>
              <td>{new Date(t.ETA).toLocaleDateString()}</td>
              <td>{t.PhuongTien}</td>
              <td>{t.TrangThai}</td>

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

export default Trips;