import React, { useEffect, useState, useCallback } from "react";
import "./Pages.css";

interface ItemType {
  LoaiHangID: number;
  TenLoai: string;
  DanhMuc: string;
  MoTa: string;
}

const ItemTypes: React.FC = () => {
  const [types, setTypes] = useState<ItemType[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<ItemType | null>(null);

  const [form, setForm] = useState({
    TenLoai: "",
    DanhMuc: "",
    MoTa: ""
  });

  const fetchData = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/itemtype/itemtype/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/itemtype/itemtype";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải loại hàng");
      const data = await res.json();
      setTypes(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchData]);

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const formatID = (id: number) =>
    "LH" + id.toString().padStart(3, "0");

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
      TenLoai: "",
      DanhMuc: "",
      MoTa: ""
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: ItemType) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      TenLoai: item.TenLoai,
      DanhMuc: item.DanhMuc,
      MoTa: item.MoTa
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.TenLoai.trim()) {
      alert("Vui lòng nhập tên loại hàng");
      return;
    }

    const body = { ...form };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/itemtype/itemtype/${selected.LoaiHangID}`
        : "http://localhost:5000/api/itemtype/additemtype";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowForm(false);
        fetchData(search);
      } else {
        alert("Lỗi server");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/itemtype/itemtype/${id}`,
        { method: "DELETE" }
      );
      if (res.ok) fetchData(search);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📂 Danh sách loại hàng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm loại hàng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm loại hàng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên loại hàng</th>
            <th>Danh mục</th>
            <th>Mô tả</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {types.map((t) => (
            <tr key={t.LoaiHangID} onClick={() => handleOpenEdit(t)}>
              <td>{formatID(t.LoaiHangID)}</td>
              <td>{t.TenLoai}</td>
              <td>{t.DanhMuc}</td>
              <td>{t.MoTa}</td>

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
                    handleDelete(t.LoaiHangID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} loại hàng</h3>

            <input
              name="TenLoai"
              placeholder="Tên loại hàng"
              value={form.TenLoai}
              onChange={handleChange}
            />
            <input
              name="DanhMuc"
              placeholder="Danh mục"
              value={form.DanhMuc}
              onChange={handleChange}
            />
            <input
              name="MoTa"
              placeholder="Mô tả"
              value={form.MoTa}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>
                {isEdit ? "Cập nhật" : "Thêm"}
              </button>

              <button
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemTypes;