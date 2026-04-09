import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
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

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const [form, setForm] = useState({
    LoaiPhuongTien: "",
    BienSo: "",
    HinhAnh: "",
    TaiTrong: "",
    TrangThai: "",
    MoTa: ""
  });

  const fetchVehicles = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/vehicle/vehicle/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/vehicle/vehicle`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách phương tiện");

      const data = await res.json();
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchVehicles(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchVehicles]);

  const formatID = (id: number) =>
    "VH" + id.toString().padStart(3, "0");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      LoaiPhuongTien: "",
      BienSo: "",
      HinhAnh: "",
      TaiTrong: "",
      TrangThai: "",
      MoTa: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Vehicle) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      LoaiPhuongTien: item.LoaiPhuongTien || "",
      BienSo: item.BienSo || "",
      HinhAnh: item.HinhAnh || "",
      TaiTrong: item.TaiTrong?.toString() || "",
      TrangThai: item.TrangThai || "",
      MoTa: item.MoTa || ""
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.LoaiPhuongTien || !form.BienSo) {
      alert("Vui lòng nhập đầy đủ Loại phương tiện và Biển số!");
      return;
    }

    const payload = {
      ...form,
      TaiTrong: Number(form.TaiTrong)
    };

    try {
      let res: Response;

      if (isEdit && selected) {
        res = await fetch(
          `http://localhost:5000/api/vehicle/vehicle/${selected.PhuongTienID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/vehicle/vehicle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Lỗi server");
      }

      alert(isEdit ? "Cập nhật thành công!" : "Thêm phương tiện thành công!");
      setShowForm(false);
      fetchVehicles(search);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/vehicle/vehicle/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error();

      alert("Xóa thành công!");
      fetchVehicles(search);
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🚚 Danh sách phương tiện</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm phương tiện..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm phương tiện
          </button>
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
          {vehicles.map((v) => (
            <tr key={v.PhuongTienID} onClick={() => handleOpenEdit(v)}>
              <td>{formatID(v.PhuongTienID)}</td>
              <td>{v.LoaiPhuongTien}</td>
              <td>{v.BienSo}</td>
              <td>
                {v.HinhAnh ? (
                  <img
                    src={`/images/${v.HinhAnh}`}
                    alt="vehicle"
                    style={{ width: "60px", height: "40px", objectFit: "cover" }}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td>{v.TaiTrong}</td>
              <td>{v.TrangThai}</td>
              <td>{v.MoTa}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(v);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(v.PhuongTienID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} phương tiện</h3>

            <input name="LoaiPhuongTien" value={form.LoaiPhuongTien} onChange={handleChange} placeholder="Loại xe" />
            <input name="BienSo" value={form.BienSo} onChange={handleChange} placeholder="Biển số" />
            <select name="HinhAnh" value={form.HinhAnh} onChange={handleChange}>
              <option value="">-- Chọn ảnh --</option>
              <option value="xe1.jpg">Xe 1</option>
              <option value="xe2.jpg">Xe 2</option>
              <option value="xe3.jpg">Xe 3</option>
            </select>
            <input name="TaiTrong" value={form.TaiTrong} onChange={handleChange} placeholder="Tải trọng" />
            <input name="TrangThai" value={form.TrangThai} onChange={handleChange} placeholder="Trạng thái" />
            <input name="MoTa" value={form.MoTa} onChange={handleChange} placeholder="Mô tả" />

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

export default Vehicles;