import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Trip {
  ChuyenDiID: number;
  MaChuyen: string;
  CangDiID: string;
  CangDenID: string;
  NgayKhoiHanh: string;
  NgayDuKienDen: string;
  PhuongTienID: string;
  TrangThai: string;
}

const Trips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Trip | null>(null);

  const [form, setForm] = useState({
    MaChuyen: "",
    CangDiID: "",
    CangDenID: "",
    NgayKhoiHanh: "",
    NgayDuKienDen: "",
    PhuongTienID: "",
    TrangThai: ""
  });
  
  const fetchTrips = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/trip/trip/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/trip/trip";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách chuyến");

      const data = await res.json();
      setTrips(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTrips(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchTrips]);

  const formatID = (id: number) =>
    "TRP" + id.toString().padStart(3, "0");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      MaChuyen: "",
      CangDiID: "",
      CangDenID: "",
      NgayKhoiHanh: "",
      NgayDuKienDen: "",
      PhuongTienID: "",
      TrangThai: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Trip) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      MaChuyen: item.MaChuyen,
      CangDiID: item.CangDiID,
      CangDenID: item.CangDenID,
      NgayKhoiHanh: item.NgayKhoiHanh?.slice(0, 10) || "",
      NgayDuKienDen: item.NgayDuKienDen?.slice(0, 10) || "",
      PhuongTienID: item.PhuongTienID,
      TrangThai: item.TrangThai
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const body = { ...form };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/trip/trip/${selected.ChuyenDiID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
      } else {
        await fetch("http://localhost:5000/api/trip/addtrip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
      }

      setShowForm(false);
      fetchTrips(search);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu dữ liệu");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`http://localhost:5000/api/trip/trip/${id}`, {
      method: "DELETE"
    });

    fetchTrips(search);
  };

  {loading && <div className="loading">Đang tải...</div>}
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🚢 Danh sách chuyến đi</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm chuyến..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
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
          {trips.map((t) => (
            <tr key={t.ChuyenDiID} onClick={() => handleOpenEdit(t)}>
              <td>{formatID(t.ChuyenDiID)}</td>
              <td>{t.MaChuyen}</td>
              <td>{t.CangDiID}</td>
              <td>{t.CangDenID}</td>
              <td>{t.NgayKhoiHanh ? new Date(t.NgayKhoiHanh).toLocaleDateString("vi-VN") : "-"}</td>
              <td>{t.NgayDuKienDen ? new Date(t.NgayDuKienDen).toLocaleDateString("vi-VN") : "-"}</td>
              <td>{t.PhuongTienID}</td>
              <td>{t.TrangThai}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(t);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.ChuyenDiID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} chuyến đi</h3>

            <input name="MaChuyen" value={form.MaChuyen} onChange={handleChange} placeholder="Mã chuyến" />
            <input name="CangDiID" value={form.CangDiID} onChange={handleChange} placeholder="Cảng đi" />
            <input name="CangDenID" value={form.CangDenID} onChange={handleChange} placeholder="Cảng đến" />

            <input type="date" name="NgayKhoiHanh" value={form.NgayKhoiHanh} onChange={handleChange} />
            <input type="date" name="NgayDuKienDen" value={form.NgayDuKienDen} onChange={handleChange} />

            <input name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange} placeholder="Phương tiện" />
            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option value="Chuẩn bị">Chuẩn bị</option>
              <option value="Đã phân công">Đã phân công</option>
              <option value="Đang chạy">Đang chạy</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Hủy">Hủy</option>
            </select>

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

export default Trips;