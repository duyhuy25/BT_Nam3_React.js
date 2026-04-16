import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Warehouse {
  KhoID: number;
  TenKho: string;
  SucChua: number;
  SoLuongContainer: number;
  DiaChi: string;
  NhanVienQuanLy: string;
}

const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Warehouse | null>(null);

  const [form, setForm] = useState({
    TenKho: "",
    SucChua: "",
    SoLuongContainer: "",
    DiaChi: "",
    NhanVienQuanLy: ""
  });

  // ✅ giống Vehicles
  const fetchWarehouses = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/warehouse/warehouse/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/warehouse/warehouse`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách kho");

      const data = await res.json();
      setWarehouses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  // ✅ debounce giống Vehicles
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchWarehouses(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchWarehouses]);

  const formatID = (id: number) =>
    "WH" + id.toString().padStart(3, "0");

  // ✅ giống Vehicles
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);

    setForm({
      TenKho: "",
      SucChua: "",
      SoLuongContainer: "",
      DiaChi: "",
      NhanVienQuanLy: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Warehouse) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      TenKho: item.TenKho || "",
      SucChua: item.SucChua?.toString() || "",
      SoLuongContainer: item.SoLuongContainer?.toString() || "",
      DiaChi: item.DiaChi || "",
      NhanVienQuanLy: item.NhanVienQuanLy || ""
    });

    setShowForm(true);
  };

  // ✅ giống Vehicles (có validate + error)
  const handleSubmit = async () => {
    if (!form.TenKho) {
      alert("Vui lòng nhập tên kho!");
      return;
    }

    const payload = {
      ...form,
      SucChua: form.SucChua ? Number(form.SucChua) : 0,
      SoLuongContainer: form.SoLuongContainer ? Number(form.SoLuongContainer) : 0
    };

    try {
      let res: Response;

      if (isEdit && selected) {
        res = await fetch(
          `http://localhost:5000/api/warehouse/warehouse/${selected.KhoID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      } else {
        res = await fetch("http://localhost:5000/api/warehouse/warehouse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Lỗi server");
      }

      alert(isEdit ? "Cập nhật thành công!" : "Thêm kho thành công!");
      setShowForm(false);
      fetchWarehouses(search);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/warehouse/warehouse/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error();

      alert("Xóa thành công!");
      fetchWarehouses(search);
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🏭 Danh sách kho</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm kho..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm kho
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên kho</th>
            <th>Sức chứa</th>
            <th>Số lượng container</th>
            <th>Địa chỉ</th>
            <th>Quản lý</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((w) => (
            <tr key={w.KhoID} onClick={() => handleOpenEdit(w)}>
              <td>{formatID(w.KhoID)}</td>
              <td>{w.TenKho}</td>
              <td>{w.SucChua}</td>
              <td>{w.SoLuongContainer}</td>
              <td>{w.DiaChi}</td>
              <td>{w.NhanVienQuanLy}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(w);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(w.KhoID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} kho</h3>

            <input name="TenKho" value={form.TenKho} onChange={handleChange} placeholder="Tên kho" />
            <input name="SucChua" value={form.SucChua} onChange={handleChange} placeholder="Sức chứa" />
            <input name="SoLuongContainer" value={form.SoLuongContainer} onChange={handleChange} placeholder="Số lượng container" />
            <input name="DiaChi" value={form.DiaChi} onChange={handleChange} placeholder="Địa chỉ" />
            <input name="NhanVienQuanLy" value={form.NhanVienQuanLy} onChange={handleChange} placeholder="Quản lý" />

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

export default Warehouses;