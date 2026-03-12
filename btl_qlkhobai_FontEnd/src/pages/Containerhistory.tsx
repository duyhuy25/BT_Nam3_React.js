import React, { useEffect, useState } from "react";
import "./Containers.css";

interface History {
  LichSuID: number;
  ContainerID: number;
  HoatDong: string;
  ThoiGian: string;
  ViTri: string;
}

const ContainerHistory = () => {

  const [history, setHistory] = useState<History[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/history/containerhistory")
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  const filteredHistory = history.filter((h) =>
    h.ContainerID.toString().includes(search)
  );

  return (
    <div>

      <div className="header">
        <h2>📜 Lịch sử Container</h2>

        <div className="toolbar">

          <input
            type="text"
            placeholder="🔍 Tìm container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add">
            + Thêm lịch sử
          </button>

        </div>
      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Container</th>
            <th>Hành động</th>
            <th>Thời gian</th>
            <th>Vị trí</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filteredHistory.map((h) => (

            <tr key={h.LichSuID}>
              <td>{h.LichSuID}</td>
              <td>{h.ContainerID}</td>
              <td>{h.HoatDong}</td>
              <td>{new Date(h.ThoiGian).toLocaleString()}</td>
              <td>{h.ViTri}</td>

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

export default ContainerHistory;