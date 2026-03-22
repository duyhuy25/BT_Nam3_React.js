import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Container {
  ContainerID: number;
  HopDongID: number;
  LoaiHangID: string;
  TrongLuong: number;
  TrangThai: string;
  KhoID: string;
  PhuongTienID: string;
  ChuyenDiID: string;
}

const Containers: React.FC = () => {

  const [containers, setContainers] = useState<Container[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);

  const [form, setForm] = useState({
    LoaiHangID: "",
    TrongLuong: "",
    TrangThai: "",
    KhoID: "",
    PhuongTienID: "",
    HopDongID: "",
    ChuyenDiID: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/container/container");
    const data = await res.json();
    setContainers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "CTN" + id.toString().padStart(3, "0");

  const filtered = containers.filter((c) =>
    formatID(c.ContainerID).includes(search)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      LoaiHangID: "",
      TrongLuong: "",
      TrangThai: "",
      KhoID: "",
      PhuongTienID: "",
      HopDongID: "",
      ChuyenDiID: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Container) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      LoaiHangID: item.LoaiHangID,
      TrongLuong: item.TrongLuong.toString(),
      TrangThai: item.TrangThai,
      KhoID: item.KhoID,
      PhuongTienID: item.PhuongTienID,
      HopDongID: item.HopDongID.toString(),
      ChuyenDiID: item.ChuyenDiID
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      TrongLuong: Number(form.TrongLuong),
      HopDongID: Number(form.HopDongID)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/container/container/${selected.ContainerID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/container/container", {
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

    await fetch(`http://localhost:5000/api/container/container/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>📦 Danh sách Container</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm container
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại hàng</th>
            <th>Trọng lượng</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>Phương tiện</th>
            <th>Hợp đồng</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.ContainerID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.ContainerID)}</td>
              <td>{c.LoaiHangID}</td>
              <td>{c.TrongLuong}</td>
              <td>{c.TrangThai}</td>
              <td>{c.KhoID}</td>
              <td>{c.PhuongTienID}</td>
              <td>{c.HopDongID}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(c);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(c.ContainerID);
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

            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} container</h3>

            <input name="LoaiHangID" placeholder="Loại hàng" value={form.LoaiHangID} onChange={handleChange} />
            <input name="TrongLuong" placeholder="Trọng lượng" value={form.TrongLuong} onChange={handleChange} />
            <input name="TrangThai" placeholder="Trạng thái" value={form.TrangThai} onChange={handleChange} />
            <input name="KhoID" placeholder="Kho" value={form.KhoID} onChange={handleChange} />
            <input name="PhuongTienID" placeholder="Phương tiện" value={form.PhuongTienID} onChange={handleChange} />
            <input name="HopDongID" placeholder="Hợp đồng" value={form.HopDongID} onChange={handleChange} />
            <input name="ChuyenDiID" placeholder="Chuyến đi" value={form.ChuyenDiID} onChange={handleChange} />

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>
                {isEdit ? "Cập nhật" : "Thêm"}
              </button>

              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                Hủy
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Containers;