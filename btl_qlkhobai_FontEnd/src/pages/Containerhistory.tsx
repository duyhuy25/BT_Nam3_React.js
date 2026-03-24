import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface History {
  LichSuID: number;
  ContainerID: number;
  HoatDong: string;
  ThoiGian: string;
  ViTri: string;
}

interface ContainerOption {
  ContainerID: number;
  formattedID: string;
}

const ContainerHistory: React.FC = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<History | null>(null);

  const [form, setForm] = useState({
    ContainerID: "",
    HoatDong: "",
    ThoiGian: "",
    ViTri: ""
  });


  const fetchHistory = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/history/containerhistory/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/history/containerhistory";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải lịch sử");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  }, []);


  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();
      const formatted = data.map((c: any) => ({
        ContainerID: c.ContainerID,
        formattedID: "CTN" + c.ContainerID.toString().padStart(3, "0")
      }));
      setContainers(formatted);
    } catch (err) {
      console.error("Error fetching containers:", err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchHistory(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchHistory]);

  useEffect(() => {
    setLoading(true);
    fetchContainers().finally(() => setLoading(false));
  }, [fetchContainers]);

  const formatID = (id: number) => "LS" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({ ContainerID: "", HoatDong: "", ThoiGian: "", ViTri: "" });
    setShowForm(true);
  };

  const handleOpenEdit = (item: History) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      ContainerID: item.ContainerID.toString(),
      HoatDong: item.HoatDong,
      ThoiGian: item.ThoiGian ? new Date(item.ThoiGian).toISOString().slice(0, 16) : "",
      ViTri: item.ViTri
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.ContainerID || !form.HoatDong || !form.ThoiGian) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }

    const body = {
      ...form,
      ContainerID: Number(form.ContainerID),
    };

    try {
      const url = isEdit && selected
        ? `http://localhost:5000/api/history/containerhistory/${selected.LichSuID}`
        : "http://localhost:5000/api/history/addcontainerhistory";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setShowForm(false);
        fetchHistory(search);
      } else {
        alert("Lỗi server khi lưu dữ liệu.");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bản ghi này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/history/containerhistory/${id}`, {
        method: "DELETE"
      });
      if (res.ok) fetchHistory(search);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;

  return (
    <div className="container-page">
      <div className="header">
        <h2>📜 Lịch sử Container</h2>
        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm mã lịch sử hoặc ID container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={handleOpenAdd}>+ Thêm lịch sử</button>
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
          {history.map((h) => (
            <tr 
              key={h.LichSuID} 
              onClick={() => handleOpenEdit(h)} 
              style={{ cursor: "pointer" }}
            >
              <td>{formatID(h.LichSuID)}</td>
              <td>{"CTN" + h.ContainerID.toString().padStart(3, "0")}</td>
              <td>
                <span className={`badge ${h.HoatDong.toLowerCase().replace(/\s/g, "-")}`}>
                  {h.HoatDong}
                </span>
              </td>
              <td>{new Date(h.ThoiGian).toLocaleString("vi-VN")}</td>
              <td>{h.ViTri || "-"}</td>
              <td>
                <button 
                  className="btn-edit" 
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(h); }}
                >
                  Sửa
                </button>
                <button 
                  className="btn-delete" 
                  onClick={(e) => { e.stopPropagation(); handleDelete(h.LichSuID); }}
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
            <h3>{isEdit ? "✏️ Cập nhật Lịch Sử" : "➕ Thêm Lịch Sử Mới"}</h3>
            
            <div className="form-group">
              <label>Container *</label>
              <select name="ContainerID" value={form.ContainerID} onChange={handleChange}>
                <option value="">-- Chọn container --</option>
                {containers.map((c) => (
                  <option key={c.ContainerID} value={c.ContainerID}>{c.formattedID}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hành động *</label>
              <select name="HoatDong" value={form.HoatDong} onChange={handleChange}>
                <option value="">-- Chọn hành động --</option>
                <option value="Nhập kho">Nhập kho</option>
                <option value="Xuất kho">Xuất kho</option>
                <option value="Di chuyển">Di chuyển</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
            </div>

            <div className="form-group">
              <label>Thời gian *</label>
              <input type="datetime-local" name="ThoiGian" value={form.ThoiGian} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Vị trí</label>
              <input 
                name="ViTri" 
                placeholder="VD: Cảng Cát Lái, Kho A1..." 
                value={form.ViTri} 
                onChange={handleChange} 
              />
            </div>

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>Lưu</button>
              <button className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerHistory;