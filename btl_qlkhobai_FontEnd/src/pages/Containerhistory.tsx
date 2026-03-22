import React, { useEffect, useState } from "react";
import "./Pages.css";

interface History {
  LichSuID: number;
  ContainerID: number;
  HoatDong: string;
  ThoiGian: string;
  ViTri: string;
}

const ContainerHistory: React.FC = () => {

  const [history, setHistory] = useState<History[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<History | null>(null);

  const [form, setForm] = useState({
    ContainerID: "",
    HoatDong: "",
    ThoiGian: "",
    ViTri: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/history/containerhistory");
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredHistory = history.filter((h) =>
    h.ContainerID.toString().includes(search)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({
      ContainerID: "",
      HoatDong: "",
      ThoiGian: "",
      ViTri: ""
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: History) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      ContainerID: item.ContainerID.toString(),
      HoatDong: item.HoatDong,
      ThoiGian: item.ThoiGian.slice(0, 16), 
      ViTri: item.ViTri
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      ContainerID: Number(form.ContainerID)
    };

    if (isEdit && selected) {
      await fetch(`http://localhost:5000/api/history/containerhistory/${selected.LichSuID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } else {
      await fetch("http://localhost:5000/api/history/containerhistory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`http://localhost:5000/api/history/containerhistory/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>📜 Lịch sử Container</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm lịch container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
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
            <tr key={h.LichSuID} onClick={() => handleOpenEdit(h)}>
              <td>{h.LichSuID}</td>
              <td>{h.ContainerID}</td>
              <td>{h.HoatDong}</td>
              <td>{new Date(h.ThoiGian).toLocaleString()}</td>
              <td>{h.ViTri}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(h);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(h.LichSuID);
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">

            <h3>{isEdit ? "Sửa" : "Thêm"} lịch sử</h3>

            <input
              name="ContainerID"
              placeholder="Container ID"
              value={form.ContainerID}
              onChange={handleChange}
            />

            <input
              name="HoatDong"
              placeholder="Hoạt động"
              value={form.HoatDong}
              onChange={handleChange}
            />

            <input
              name="ThoiGian"
              type="datetime-local"
              value={form.ThoiGian}
              onChange={handleChange}
            />

            <input
              name="ViTri"
              placeholder="Vị trí"
              value={form.ViTri}
              onChange={handleChange}
            />

            <button onClick={handleSubmit}>
              {isEdit ? "Cập nhật" : "Thêm"}
            </button>

            <button onClick={() => setShowForm(false)}>
              Hủy
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerHistory;