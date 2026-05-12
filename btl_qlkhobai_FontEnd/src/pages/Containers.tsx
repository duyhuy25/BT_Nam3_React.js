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
interface PhuongTienOption { PhuongTienID: number; BienSo: string; TrangThai: string; }
interface HopDongOption { HopDongID: number; MaHopDong?: string; TenKH?: string; }
interface TripOption { ChuyenDiID: number; MaChuyen: string; PhuongTienID: number; TrangThai: string; BienSo?: string; }


const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loaiHangs, setLoaiHangs] = useState<LoaiHangOption[]>([]);
  const [khos, setKhos] = useState<KhoOption[]>([]);
  const [phuongTiens, setPhuongTiens] = useState<PhuongTienOption[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);
  const [trips, setTrips] = useState<TripOption[]>([]);

  const [showWarehouseActionModal, setShowWarehouseActionModal] = useState(false);
  const [showTripActionModal, setShowTripActionModal] = useState(false);
  const [actionContainer, setActionContainer] = useState<Container | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Container | null>(null);


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
      const [lh, k, pt, hd, t] = await Promise.all([
        fetch("http://localhost:5000/api/itemtype/itemtype").then(res => res.json()),
        fetch("http://localhost:5000/api/warehouse/warehouse").then(res => res.json()),
        fetch("http://localhost:5000/api/vehicle/vehicle").then(res => res.json()),
        fetch("http://localhost:5000/api/contract/contract").then(res => res.json()),
        fetch("http://localhost:5000/api/trip/trip").then(res => res.json())
      ]);
      setLoaiHangs(lh); setKhos(k); setPhuongTiens(pt); setHopDongs(hd); setTrips(t);
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

  const handleUpdateStatus = async (container: Container, newStatus: string) => {
    if (newStatus === "Trong kho") {
      setActionContainer(container);
      setSelectedActionId("");
      setShowWarehouseActionModal(true);
      return;
    }
    if (newStatus === "Đã phân công") {
      setActionContainer(container);
      setSelectedActionId("");
      setSelectedVehicleId("");
      setShowTripActionModal(true);
      return;
    }

    const body = {
      ...container,
      TrangThai: newStatus,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/container/container/${container.ContainerID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchContainers(search);
        fetchOptions(); // Refresh warehouse counts
      } else {
        alert("Lỗi khi cập nhật trạng thái");
      }
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const handleConfirmWarehouse = async () => {
    if (!actionContainer || !selectedActionId) return;

    const body = {
      ...actionContainer,
      TrangThai: "Trong kho",
      KhoID: Number(selectedActionId),
    };

    try {
      const res = await fetch(`http://localhost:5000/api/container/container/${actionContainer.ContainerID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowWarehouseActionModal(false);
        fetchContainers(search);
        fetchOptions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmTrip = async () => {
    if (!actionContainer || !selectedActionId || !selectedVehicleId) return;

    const selectedTrip = trips.find(t => t.ChuyenDiID === Number(selectedActionId));
    if (!selectedTrip) return;

    // Update Trip with selected vehicle if changed
    if (selectedTrip.PhuongTienID !== Number(selectedVehicleId)) {
      try {
        await fetch(`http://localhost:5000/api/trip/trip/${selectedTrip.ChuyenDiID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...selectedTrip, PhuongTienID: Number(selectedVehicleId) }),
        });
      } catch (err) { console.error("Error updating trip vehicle:", err); }
    }

    const body = {
      ...actionContainer,
      TrangThai: "Đã phân công",
      PhuongTienID: Number(selectedVehicleId),
    };

    try {
      const res = await fetch(`http://localhost:5000/api/container/container/${actionContainer.ContainerID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowTripActionModal(false);
        fetchContainers(search);
        fetchOptions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Xóa container này?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/container/container/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchContainers(search);
      } else {
        const errorData = await res.json();
        alert("Lỗi khi xóa container: " + (errorData.message || "Không rõ nguyên nhân"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Lỗi kết nối server khi xóa");
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
            <th style={{ background: '#007bff', color: '#fff', textAlign: 'center' }}>Điều phối</th>
            <th>Tác vụ</th>
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.ContainerID}>
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
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                  {c.TrangThai === "Rỗng" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Đang đóng hàng")}
                      style={{ background: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Bắt đầu đóng hàng
                    </button>
                  )}
                  {c.TrangThai === "Đang đóng hàng" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Đã đóng hàng")}
                      style={{ background: '#2980b9', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Hoàn tất đóng hàng
                    </button>
                  )}
                  {c.TrangThai === "Đã đóng hàng" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Trong kho")}
                      style={{ background: '#8e44ad', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Nhập kho
                    </button>
                  )}
                  {c.TrangThai === "Trong kho" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Đã phân công")}
                      style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Phân công chuyến
                    </button>
                  )}
                  {c.TrangThai === "Đã phân công" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Đang vận chuyển")}
                      style={{ background: '#e67e22', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Bắt đầu vận chuyển
                    </button>
                  )}
                  {c.TrangThai === "Đang vận chuyển" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Đã đến nơi")}
                      style={{ background: '#27ae60', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Đã đến nơi
                    </button>
                  )}
                  {c.TrangThai === "Đã đến nơi" && (
                    <button 
                      onClick={() => handleUpdateStatus(c, "Đã giao")}
                      style={{ background: '#2ecc71', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '120px' }}
                    >
                      Giao hàng xong
                    </button>
                  )}
                  {c.TrangThai === "Đã giao" && (
                    <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '12px' }}>Hoàn thành ✓</span>
                  )}
                  {c.TrangThai === "Hỏng" && (
                    <span style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '12px' }}>Đã hỏng</span>
                  )}
                </div>
              </td>
              <td>
                <button className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenEdit(c); }}>Sửa</button>
                <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDelete(c.ContainerID); }}>Xóa</button>
              </td>
            </tr>
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
              <option value="Đang đóng hàng">Đang đóng hàng</option>
              <option value="Đã đóng hàng">Đã đóng hàng</option>
              <option value="Trong kho">Trong kho</option>
              <option value="Đã phân công">Đã phân công</option>
              <option value="Đang vận chuyển">Đang vận chuyển</option>
              <option value="Đã đến nơi">Đã đến nơi</option>
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

      {showWarehouseActionModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chọn kho lưu trữ</h3>
            <label>Danh sách kho *</label>
            <select value={selectedActionId} onChange={(e) => setSelectedActionId(e.target.value)}>
              <option value="">-- Chọn kho --</option>
              {khos.map(k => <option key={k.KhoID} value={k.KhoID}>{k.TenKho}</option>)}
            </select>
            <div className="modal-actions">
              <button className="btn-submit" onClick={handleConfirmWarehouse}>Xác nhận</button>
              <button className="btn-cancel" onClick={() => setShowWarehouseActionModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {showTripActionModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Phân công chuyến đi & Phương tiện</h3>
            
            <label>1. Chọn chuyến đi (Trạng thái: Chuẩn bị) *</label>
            <select 
              value={selectedActionId} 
              onChange={(e) => {
                const tripId = e.target.value;
                setSelectedActionId(tripId);
                const trip = trips.find(t => t.ChuyenDiID === Number(tripId));
                if (trip) setSelectedVehicleId(trip.PhuongTienID.toString());
              }}
            >
              <option value="">-- Chọn chuyến --</option>
              {trips
                .filter(t => t.TrangThai === "Chuẩn bị")
                .map(t => (
                  <option key={t.ChuyenDiID} value={t.ChuyenDiID}>
                    {t.MaChuyen} (Hiện tại: {phuongTiens.find(p => p.PhuongTienID === t.PhuongTienID)?.BienSo || "Chưa có xe"})
                  </option>
                ))}
            </select>

            <label style={{ marginTop: '15px' }}>2. Chọn phương tiện (Chỉ xe Sẵn sàng) *</label>
            <select 
              value={selectedVehicleId} 
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              <option value="">-- Chọn xe --</option>
              {phuongTiens
                .filter(p => p.TrangThai === "Sẵn sàng" || (selectedActionId && p.PhuongTienID === trips.find(t => t.ChuyenDiID === Number(selectedActionId))?.PhuongTienID))
                .map(p => (
                  <option key={p.PhuongTienID} value={p.PhuongTienID}>
                    {p.BienSo} ({p.TrangThai})
                  </option>
                ))}
            </select>

            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn-submit" onClick={handleConfirmTrip}>Xác nhận</button>
              <button className="btn-cancel" onClick={() => setShowTripActionModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Containers;