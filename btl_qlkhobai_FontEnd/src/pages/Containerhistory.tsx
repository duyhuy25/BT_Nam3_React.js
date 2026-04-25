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
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

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
      const cleanData = data.filter(
        (item: any) => item.LichSuID && item.ContainerID
      );
      // Sắp xếp mới nhất lên đầu
      cleanData.sort((a: History, b: History) => b.LichSuID - a.LichSuID);

      setHistory(cleanData);
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

  const formatID = (id?: number) => {
    if (!id) return "LS---";
    return "LS" + id.toString().padStart(3, "0");
  };
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
        const data = await res.json();
        console.log("DATA RETURN:", data);

        if (!data || !data.LichSuID || !data.ContainerID) {
          console.warn("Data không hợp lệ, reload lại");
          fetchHistory(search);
          setShowForm(false);
          return;
        }

        if (isEdit && selected) {
          setHistory(prev =>
            prev.map(item =>
              item.LichSuID === selected.LichSuID ? data : item
            )
          );
        } else {
          setHistory(prev => [data, ...prev]);
        }

        setShowForm(false);
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

  const groupedHistoryEntries = React.useMemo(() => {
    const groups: Record<number, History[]> = {};
    history.forEach((h) => {
      if (!groups[h.ContainerID]) groups[h.ContainerID] = [];
      groups[h.ContainerID].push(h);
    });

    Object.values(groups).forEach((list) => {
      list.sort((a, b) => {
        const timeA = a.ThoiGian ? new Date(a.ThoiGian).getTime() : 0;
        const timeB = b.ThoiGian ? new Date(b.ThoiGian).getTime() : 0;
        if (timeA !== timeB) return timeA - timeB;
        return a.LichSuID - b.LichSuID;
      });
    });

    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [history]);

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
            <th>Trạng thái gần nhất</th>
            <th>Cập nhật cuối</th>
            <th>Vị trí hiện hành</th>
          </tr>
        </thead>
        <tbody>
          {groupedHistoryEntries.map(([containerIdStr, group], groupIndex) => {
            const containerId = Number(containerIdStr);
            const latest = group[group.length - 1];
            const isExpanded = expandedRowId === containerId;

            return (
              <React.Fragment key={`group-${containerId}`}>
                <tr
                  onClick={() => setExpandedRowId(isExpanded ? null : containerId)}
                  style={{ cursor: "pointer", background: isExpanded ? "#f0f8ff" : "inherit" }}
                >
                  <td>
                    <span style={{ marginRight: 8, fontSize: 12, color: '#666' }}>{isExpanded ? '▼' : '▶'}</span>
                    {formatID(latest.LichSuID)}
                  </td>
                  <td>CTN{containerId.toString().padStart(3, "0")}</td>
                  <td>
                    <span className={`badge ${latest.HoatDong.toLowerCase().replace(/\s/g, "-")}`}>
                      {latest.HoatDong}
                    </span>
                  </td>
                  <td>{latest.ThoiGian ? new Date(latest.ThoiGian).toLocaleString("vi-VN") : "-"}</td>
                  <td>{latest.ViTri || "-"}</td>
                </tr>
                {isExpanded && (
                  <tr className="expanded-row" style={{ backgroundColor: "#f9f9f9" }}>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>⏱ Lịch sử cập nhật: CTN{containerId.toString().padStart(3, "0")}</h4>
                        <table style={{ background: "#fff", border: "1px solid #ccc", marginBottom: 0 }}>
                          <thead>
                            <tr style={{ background: "#eef2f5" }}>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc", width: "60px", textAlign: 'center' }}>STT</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Hành động</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Thời gian</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Vị trí</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc", width: "120px" }}>Tác vụ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.map((h, i) => (
                              <tr key={h.LichSuID} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "8px", textAlign: 'center', fontWeight: 'bold' }}>{i + 1}</td>
                                <td style={{ padding: "8px" }}><span className={`badge ${h.HoatDong.toLowerCase().replace(/\s/g, "-")}`}>{h.HoatDong}</span></td>
                                <td style={{ padding: "8px" }}>{h.ThoiGian ? new Date(h.ThoiGian).toLocaleString("vi-VN") : "-"}</td>
                                <td style={{ padding: "8px" }}>{h.ViTri || "-"}</td>
                                <td style={{ padding: "8px" }}>
                                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(h); }}>Sửa</button>
                                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(h.LichSuID); }}>Xóa</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
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