import React, { useEffect, useState } from "react";

interface History {
    LichSuID: number;
    ContainerID: number;
    HoatDong: string;
    ThoiGian: string;
    ViTri: string;
}

const ContainerHistory = () => {

  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/history/containerhistory")
      .then(res => res.json())
      .then(data => setHistory(data));

  }, []);

  return (

    <div>

      <div className="header">

        <h2>📜 Lịch sử Container</h2>

        <button>Thêm lịch sử</button>

      </div>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Container</th>
            <th>Hành động</th>
            <th>Thời gian</th>
            <th>Vị trí</th>
          </tr>

        </thead>

        <tbody>

          {history.map((h) => (

            <tr key={h.LichSuID}>

              <td>{h.LichSuID}</td>
              <td>{h.ContainerID}</td>
              <td>{h.HoatDong}</td>
              <td>{h.ThoiGian}</td>
              <td>{h.ViTri}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default ContainerHistory;