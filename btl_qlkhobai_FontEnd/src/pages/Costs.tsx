import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Cost {
  ChiPhiID: number;
  HopDongID: number;
  ContainerID: number | null;
  LoaiChiPhi: string;
  SoTien: number;
  ThuKhachHang: string;
  NgayChi: string;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
  TenKH?: string;
}

interface ContainerOption {
  ContainerID: number;
  formattedID: string;
  HopDongID?: number;
}

const Costs: React.FC = () => {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);
  const [containers, setContainers] = useState<ContainerOption[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Cost | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const [form, setForm] = useState({
    HopDongID: "",
    ContainerID: "",
    LoaiChiPhi: "",
    SoTien: "",
    ThuKhachHang: "Không",
    NgayChi: new Date().toISOString().split("T")[0],
  });

  const fetchCosts = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/cost/cost/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/cost/cost";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách chi phí");

      const data = await res.json();
      setCosts(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi phí");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHopDongs = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contract/contract");
      const data = await res.json();
      setHopDongs(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchContainers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();

      const formatted = data.map((c: any) => ({
        ContainerID: c.ContainerID,
        formattedID: "CTN" + c.ContainerID.toString().padStart(3, "0"),
        HopDongID: c.HopDongID,
      }));

      setContainers(formatted);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCosts();
    fetchHopDongs();
    fetchContainers();
  }, [fetchCosts, fetchHopDongs, fetchContainers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCosts(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchCosts]);

  const formatID = (id: number) => "CP" + id.toString().padStart(3, "0");

  const hopDongMap = Object.fromEntries(
    hopDongs.map((h) => [h.HopDongID, h])
  );

  const containerMap = Object.fromEntries(
    containers.map((c) => [c.ContainerID, c])
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "HopDongID") {
      setForm({
        ...form,
        [name]: value,
        ContainerID: "" 
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      HopDongID: "",
      ContainerID: "",
      LoaiChiPhi: "",
      SoTien: "",
      ThuKhachHang: "Không",
      NgayChi: new Date().toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Cost) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      HopDongID: item.HopDongID.toString(),
      ContainerID: item.ContainerID ? item.ContainerID.toString() : "",
      LoaiChiPhi: item.LoaiChiPhi,
      SoTien: item.SoTien.toString(),
      ThuKhachHang: item.ThuKhachHang,
      NgayChi: item.NgayChi ? new Date(item.NgayChi).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.HopDongID) {
      alert("Vui lòng chọn hợp đồng");
      return;
    }

    if (!form.LoaiChiPhi.trim()) {
      alert("Vui lòng nhập loại chi phí");
      return;
    }

    if (!form.SoTien || isNaN(Number(form.SoTien)) || Number(form.SoTien) <= 0) {
      alert("Số tiền phải là số dương");
      return;
    }

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      ContainerID: form.ContainerID ? Number(form.ContainerID) : null,
      SoTien: Number(form.SoTien),
    };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/cost/cost/${selected.ChiPhiID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/cost/addcost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchCosts(search);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu chi phí");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/api/cost/cost/${id}`, {
        method: "DELETE",
      });

      fetchCosts(search);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa");
    }
  };

  const groupedCosts = React.useMemo(() => {
    const groups: Record<number, Cost[]> = {};
    costs.forEach((c) => {
      if (!groups[c.HopDongID]) groups[c.HopDongID] = [];
      groups[c.HopDongID].push(c);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [costs]);

  return (
    <div className="container-page">
      {loading && <div className="loading">Đang tải dữ liệu...</div>}
      {error && <div className="error">Lỗi: {error}</div>}
      
      <div className="header">
        <h2>💰 Quản lý chi phí theo Hợp đồng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm chi phí, hợp đồng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm chi phí
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Hợp đồng</th>
            <th>Số lượng khoản chi</th>
            <th>Tổng tiền</th>
            <th>Cập nhật cuối</th>
          </tr>
        </thead>

        <tbody>
          {groupedCosts.map(([hopDongIdStr, group]) => {
            const hopDongId = Number(hopDongIdStr);
            const hd = hopDongMap[hopDongId];
            const isExpanded = expandedRowId === hopDongId;
            const totalAmount = group.reduce((sum, c) => sum + c.SoTien, 0);
            const latestDate = group.reduce((max, c) => {
              const d = new Date(c.NgayChi).getTime();
              return d > max ? d : max;
            }, 0);

            return (
              <React.Fragment key={`group-${hopDongId}`}>
                <tr 
                  onClick={() => setExpandedRowId(isExpanded ? null : hopDongId)}
                  style={{ cursor: "pointer", background: isExpanded ? "#f0f8ff" : "inherit" }}
                >
                  <td>
                    <span style={{ marginRight: 8, fontSize: 12, color: '#666' }}>{isExpanded ? '▼' : '▶'}</span>
                    {hd ? hd.MaHopDong || `HD${hd.HopDongID.toString().padStart(3, "0")}` : `HD${hopDongId.toString().padStart(3, "0")}`}
                  </td>
                  <td>{group.length} khoản</td>
                  <td style={{ fontWeight: "bold", color: "#2c3e50" }}>{totalAmount.toLocaleString("vi-VN")} VNĐ</td>
                  <td>{latestDate > 0 ? new Date(latestDate).toLocaleDateString("vi-VN") : "-"}</td>
                </tr>
                {isExpanded && (
                  <tr className="expanded-row" style={{ backgroundColor: "#f9f9f9" }}>
                    <td colSpan={4} style={{ padding: 0 }}>
                      <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>📋 Chi tiết chi phí: {hd?.MaHopDong || `HD${hopDongId.toString().padStart(3, "0")}`}</h4>
                        <table style={{ background: "#fff", border: "1px solid #ccc", marginBottom: 0 }}>
                          <thead>
                            <tr style={{ background: "#eef2f5" }}>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc", width: "60px", textAlign: 'center' }}>STT</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Mã CP</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Loại chi phí</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Số tiền</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Container</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Ngày chi</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc" }}>Thu KH</th>
                              <th style={{ padding: "8px", borderBottom: "1px solid #ccc", width: "120px" }}>Tác vụ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.map((c, i) => (
                              <tr key={c.ChiPhiID} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "8px", textAlign: 'center', fontWeight: 'bold' }}>{i + 1}</td>
                                <td style={{ padding: "8px" }}>{formatID(c.ChiPhiID)}</td>
                                <td style={{ padding: "8px" }}>{c.LoaiChiPhi}</td>
                                <td style={{ padding: "8px", fontWeight: "600" }}>{c.SoTien.toLocaleString("vi-VN")}</td>
                                <td style={{ padding: "8px" }}>{containerMap[c.ContainerID || 0]?.formattedID || "-"}</td>
                                <td style={{ padding: "8px" }}>{c.NgayChi ? new Date(c.NgayChi).toLocaleDateString("vi-VN") : "-"}</td>
                                <td style={{ padding: "8px" }}>
                                  <span className={`badge ${c.ThuKhachHang === 'Có' ? 'success' : 'warning'}`}>
                                    {c.ThuKhachHang}
                                  </span>
                                </td>
                                <td style={{ padding: "8px" }}>
                                  <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }}>Sửa</button>
                                  <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(c.ChiPhiID); }}>Xóa</button>
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
            <h3>{isEdit ? "✏️ Sửa chi phí" : "➕ Thêm chi phí"}</h3>

            <label>Hợp đồng *</label>
            <select
              name="HopDongID"
              value={form.HopDongID}
              onChange={handleChange}
            >
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID.toString().padStart(3, "0")}`}
                </option>
              ))}
            </select>

            <label>Container</label>
            <select
              name="ContainerID"
              value={form.ContainerID}
              onChange={handleChange}
              disabled={!form.HopDongID}
              style={!form.HopDongID ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
            >
              <option value="">-- {form.HopDongID ? "Không chọn" : "Vui lòng chọn Hợp đồng trước"} --</option>
              {containers
                .filter(ct => ct.HopDongID?.toString() === form.HopDongID)
                .map((ct) => (
                <option key={ct.ContainerID} value={ct.ContainerID}>
                  {ct.formattedID}
                </option>
              ))}
            </select>

            <label>Loại chi phí *</label>
            <input
              name="LoaiChiPhi"
              value={form.LoaiChiPhi}
              onChange={handleChange}
            />

            <label>Số tiền *</label>
            <input
              type="number"
              name="SoTien"
              value={form.SoTien}
              onChange={handleChange}
            />

            <label>Ngày chi *</label>
            <input
              type="date"
              name="NgayChi"
              value={form.NgayChi}
              onChange={handleChange}
            />

            <label>Thu khách hàng</label>
            <select
              name="ThuKhachHang"
              value={form.ThuKhachHang}
              onChange={handleChange}
            >
              <option value="Không">Không</option>
              <option value="Có">Có</option>
            </select>

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

export default Costs;