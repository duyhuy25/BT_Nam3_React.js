import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Container {
  ContainerID: number;
  HopDongID: number;
  LoaiHangID: number;
  TrongLuong: number;
  TrangThai: string;
  KhoID: number | null;
  PhuongTienID: number | null;
}

interface LoaiHangOption { LoaiHangID: number; TenLoai: string; }
interface KhoOption { KhoID: number; TenKho: string; }
interface PhuongTienOption { PhuongTienID: number; BienSo: string; }
interface HopDongOption { HopDongID: number; MaHopDong?: string; TenKH?: string; }

interface ContainerHistory {
  LichSuID: number;
  ContainerID: number;
  ThoiGian: string;
  HoatDong: string;
  ViTri: string;
  MaContainer: string;
}

const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loaiHangs, setLoaiHangs] = useState<LoaiHangOption[]>([]);
  const [khos, setKhos] = useState<KhoOption[]>([]);
  const [phuongTiens, setPhuongTiens] = useState<PhuongTienOption[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);

  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [expandedHistory, setExpandedHistory] = useState<ContainerHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [form, setForm] = useState({
    LoaiHangID: "", TrongLuong: "", TrangThai: "Rỗng",
    KhoID: "", PhuongTienID: "", HopDongID: "",
  });

  const fetchContainers = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim() 
        ? `http://localhost:5000/api/container/container/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/container/container";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách container");
      const data = await res.json();
      setContainers(data);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    }
  }, []);

  const fetchOptions = useCallback(async () => {
    try {
      const [lh, k, pt, hd] = await Promise.all([
        fetch("http://localhost:5000/api/itemtype/itemtype").then(res => res.json()),
        fetch("http://localhost:5000/api/warehouse/warehouse").then(res => res.json()),
        fetch("http://localhost:5000/api/vehicle/vehicle").then(res => res.json()),
        fetch("http://localhost:5000/api/contract/contract").then(res => res.json())
      ]);
      setLoaiHangs(lh); setKhos(k); setPhuongTiens(pt); setHopDongs(hd);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchContainers(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, fetchContainers]);

  useEffect(() => {
    setLoading(true);
    fetchOptions().finally(() => setLoading(false));
  }, [fetchOptions]);

  const formatID = (id: number) => "CTN" + id.toString().padStart(3, "0");
  const formatContractID = (id: number) =>
  "HD" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEdit(false); setSelected(null);
    setForm({ LoaiHangID: "", TrongLuong: "", TrangThai: "Rỗng", KhoID: "", PhuongTienID: "", HopDongID: "" });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Container) => {
    setIsEdit(true); setSelected(item);
    setForm({
      LoaiHangID: item.LoaiHangID.toString(),
      TrongLuong: item.TrongLuong.toString(),
      TrangThai: item.TrangThai,
      KhoID: item.KhoID?.toString() || "",
      PhuongTienID: item.PhuongTienID?.toString() || "",
      HopDongID: item.HopDongID.toString(),
    });
    setShowForm(true);
  };

  const handleToggleExpand = async (containerId: number) => {
    if (expandedRowId === containerId) {
      setExpandedRowId(null);
      return;
    }
    setExpandedRowId(containerId);
    setLoadingHistory(true);
    try {
      const res = await fetch(`http://localhost:5000/api/containerhistory/containerhistory/search?search=${formatID(containerId)}`);
      if (res.ok) {
        const data = await res.json();
        setExpandedHistory(data);
      } else {
        setExpandedHistory([]);
      }
    } catch (err) {
      console.error(err);
      setExpandedHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.LoaiHangID || !form.HopDongID || !form.TrongLuong) {
      alert("Vui lòng điền đủ thông tin bắt buộc (*)");
      return;
    }

    const body = {
      LoaiHangID: Number(form.LoaiHangID),
      TrongLuong: Number(form.TrongLuong),
      TrangThai: form.TrangThai,
      HopDongID: Number(form.HopDongID),
      KhoID: form.KhoID ? Number(form.KhoID) : null,
      PhuongTienID: form.PhuongTienID ? Number(form.PhuongTienID) : null,
    };

    try {
      const url = isEdit && selected 
        ? `http://localhost:5000/api/container/container/${selected.ContainerID}`
        : "http://localhost:5000/api/container/addcontainer";
      
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        fetchContainers(search); 
      } else {
        alert("Lỗi server khi lưu dữ liệu");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa container này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/container/container/${id}`, { method: "DELETE" });
      if (res.ok) fetchContainers(search);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="loading">Đang tải hệ thống...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>📦 Quản lý Container</h2>
        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm container..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-add" onClick={handleOpenAdd}>+ Thêm container</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại hàng</th>
            <th>Trọng lượng (kg)</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>Phương tiện</th>
            <th>Hợp đồng</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <React.Fragment key={c.ContainerID}>
              <tr onClick={() => handleToggleExpand(c.ContainerID)} style={{ cursor: "pointer" }}>
                <td>{formatID(c.ContainerID)}</td>
                <td>{loaiHangs.find(lh => lh.LoaiHangID === c.LoaiHangID)?.TenLoai || c.LoaiHangID}</td>
                <td>{c.TrongLuong.toLocaleString("vi-VN")}</td>
                <td>{c.TrangThai}</td>
                <td>{khos.find(k => k.KhoID === c.KhoID)?.TenKho || "-"}</td>
                <td>{phuongTiens.find(pt => pt.PhuongTienID === c.PhuongTienID)?.BienSo || "-"}</td>
                <td>
                  {
                    hopDongs.find(hd => hd.HopDongID === c.HopDongID)?.MaHopDong 
                    || formatContractID(c.HopDongID)
                  }
                </td>              
                <td>
                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }}>Sửa</button>
                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(c.ContainerID); }}>Xóa</button>
                </td>
              </tr>
              {expandedRowId === c.ContainerID && (
                <tr className="expanded-row" style={{ backgroundColor: "#f9f9f9" }}>
                  <td colSpan={8} style={{ padding: 0 }}>
                    <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                      <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>⏱ Lịch sử thay đổi: {formatID(c.ContainerID)}</h4>
                      {loadingHistory ? (
                        <p style={{ margin: 0 }}>Đang tải lịch sử...</p>
                      ) : expandedHistory.length > 0 ? (
                        <table style={{ background: "#fff", border: "1px solid #ccc", marginBottom: 0 }}>
                           <thead>
                             <tr style={{ background: "#eef2f5" }}>
                               <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Thời gian</th>
                               <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Hành động</th>
                               <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Vị trí</th>
                             </tr>
                           </thead>
                           <tbody>
                             {expandedHistory.map((h, i) => (
                               <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                                 <td style={{ padding: "8px" }}>{new Date(h.ThoiGian).toLocaleString("vi-VN")}</td>
                                 <td style={{ padding: "8px" }}><span className={`badge ${h.HoatDong.toLowerCase().replace(/\s/g, "-")}`}>{h.HoatDong}</span></td>
                                 <td style={{ padding: "8px" }}>{h.ViTri || "-"}</td>
                               </tr>
                             ))}
                           </tbody>
                        </table>
                      ) : (
                        <p style={{ fontStyle: "italic", margin: 0, color: "#666" }}>Chưa có lịch sử trạng thái con.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "✏️ Cập nhật Container" : "➕ Tạo mới Container"}</h3>
            
            <label>Loại hàng *</label>
            <select name="LoaiHangID" value={form.LoaiHangID} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              {loaiHangs.map(lh => <option key={lh.LoaiHangID} value={lh.LoaiHangID}>{lh.TenLoai}</option>)}
            </select>

            <label>Trọng lượng (kg) *</label>
            <input type="number" name="TrongLuong" value={form.TrongLuong} onChange={handleChange} />

            <label>Trạng thái</label>
            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Rỗng">Rỗng</option>
              <option value="Đầy">Đầy</option>
              <option value="Đang vận chuyển">Đang vận chuyển</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Hỏng">Hỏng</option>
            </select>

            <label>Kho</label>
            <select name="KhoID" value={form.KhoID} onChange={handleChange}>
              <option value="">-- Trống --</option>
              {khos.map(k => <option key={k.KhoID} value={k.KhoID}>{k.TenKho}</option>)}
            </select>

            <label>Phương tiện</label>
            <select name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange}>
              <option value="">-- Trống --</option>
              {phuongTiens.map(pt => <option key={pt.PhuongTienID} value={pt.PhuongTienID}>{pt.BienSo}</option>)}
            </select>

            <label>Hợp đồng *</label>
            <select name="HopDongID" value={form.HopDongID} onChange={handleChange}>
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map(hd => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || formatContractID(hd.HopDongID)}
                </option>
              ))}
            </select>

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

export default Containers;