import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Invoice {
  HoaDonID: number;
  HopDongID: number;
  SoTien: number;
  NgayLap: string;
  PhanTramDaThanhToan: number;
}

interface Payment {
  ThanhToanID: number;
  HoaDonID: number;
  SoTien: number;
  PhuongThuc: string;
  ThoiGian: string;
}

interface HopDongOption {
  HopDongID: number;
  MaHopDong?: string;
  TenKH?: string;
}

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDongOption[]>([]);
  const [paymentsMap, setPaymentsMap] = useState<Record<number, Payment[]>>({});

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [form, setForm] = useState({
    HopDongID: "",
    SoTien: "",
    NgayLap: "",
  });

  // State for Payment Modals
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showManagePaymentModal, setShowManagePaymentModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  const [paymentForm, setPaymentForm] = useState({
    SoTien: "",
    PhuongThuc: "",
    ThoiGian: "",
  });

  const fetchPaymentsForInvoices = async (invs: Invoice[]) => {
    try {
      const pMap: Record<number, Payment[]> = {};
      await Promise.all(
        invs.map(async (inv) => {
          const res = await fetch(`http://localhost:5000/api/payment/invoice/${inv.HoaDonID}`);
          if (res.ok) {
            const data = await res.json();
            pMap[inv.HoaDonID] = data;
          } else {
            pMap[inv.HoaDonID] = [];
          }
        })
      );
      setPaymentsMap(pMap);
    } catch (err) {
      console.error("Lỗi khi tải payment:", err);
    }
  };

  const fetchInvoices = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/invoice/invoice/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/invoice/invoice";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách hóa đơn");

      const data = await res.json();
      setInvoices(data);
      await fetchPaymentsForInvoices(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải hóa đơn");
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

  useEffect(() => {
    fetchInvoices();
    fetchHopDongs();
  }, [fetchInvoices, fetchHopDongs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchInvoices(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchInvoices]);

  const formatID = (id: number) => "HDN" + id.toString().padStart(3, "0");

  const hopDongMap = Object.fromEntries(
    hopDongs.map((h) => [h.HopDongID, h])
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelectedInvoice(null);
    setForm({
      HopDongID: "",
      SoTien: "",
      NgayLap: "",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Invoice) => {
    setIsEdit(true);
    setSelectedInvoice(item);
    setForm({
      HopDongID: item.HopDongID.toString(),
      SoTien: item.SoTien.toString(),
      NgayLap: item.NgayLap ? item.NgayLap.slice(0, 10) : "",
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.HopDongID) {
      alert("Vui lòng chọn hợp đồng");
      return;
    }

    if (!form.SoTien || isNaN(Number(form.SoTien)) || Number(form.SoTien) <= 0) {
      alert("Số tiền phải là số dương");
      return;
    }

    if (!form.NgayLap) {
      alert("Vui lòng chọn ngày lập");
      return;
    }

    const body = {
      ...form,
      HopDongID: Number(form.HopDongID),
      SoTien: Number(form.SoTien),
      PhanTramDaThanhToan: 0, // Frontend now computes this
      NgayLap: form.NgayLap || null,
    };

    try {
      if (isEdit && selectedInvoice) {
        await fetch(
          `http://localhost:5000/api/invoice/invoice/${selectedInvoice.HoaDonID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/invoice/addinvoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchInvoices(search);
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu hóa đơn");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa hóa đơn này (và mọi thanh toán liên quan)?")) return;

    try {
      await fetch(`http://localhost:5000/api/invoice/invoice/${id}`, {
        method: "DELETE",
      });

      fetchInvoices(search);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa");
    }
  };

  // --- PAYMENT LOGIC ---

  const handleOpenAddPayment = (invoice: Invoice) => {
    setActiveInvoice(invoice);
    setPaymentForm({
      SoTien: "",
      PhuongThuc: "",
      ThoiGian: "",
    });
    setShowAddPaymentModal(true);
  };

  const handleOpenManagePayment = (invoice: Invoice) => {
    setActiveInvoice(invoice);
    setShowManagePaymentModal(true);
  };

  const handleSubmitPayment = async () => {
    if (!activeInvoice) return;
    const remain = calculatePaymentStats(activeInvoice).remain;
    const paymentAmount = Number(paymentForm.SoTien);

    if (!paymentForm.SoTien || isNaN(paymentAmount) || paymentAmount <= 0) {
      alert("Số tiền thanh toán phải hợp lệ");
      return;
    }

    if (paymentAmount > remain) {
      alert(`Số tiền thanh toán không được vượt quá số tiền còn lại (${formatCurrency(remain)})!`);
      return;
    }

    const body = {
      HoaDonID: activeInvoice.HoaDonID,
      SoTien: Number(paymentForm.SoTien),
      PhuongThuc: paymentForm.PhuongThuc || "Khác",
      ThoiGian: paymentForm.ThoiGian || new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/payment/addpayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Lỗi khi thêm thanh toán");

      setShowAddPaymentModal(false);
      
      // Reload just the payments for this invoice
      const paymentsRes = await fetch(`http://localhost:5000/api/payment/invoice/${activeInvoice.HoaDonID}`);
      if (paymentsRes.ok) {
        const newPayments = await paymentsRes.json();
        setPaymentsMap((prev) => ({ ...prev, [activeInvoice.HoaDonID]: newPayments }));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi thêm thanh toán");
    }
  };

  const handleDeletePayment = async (paymentId: number, invoiceId: number) => {
    if (!window.confirm("Xóa giao dịch thanh toán này?")) return;

    try {
      await fetch(`http://localhost:5000/api/payment/${paymentId}`, {
        method: "DELETE",
      });

      // Reload payments for this invoice
      const paymentsRes = await fetch(`http://localhost:5000/api/payment/invoice/${invoiceId}`);
      if (paymentsRes.ok) {
        const newPayments = await paymentsRes.json();
        setPaymentsMap((prev) => ({ ...prev, [invoiceId]: newPayments }));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa thanh toán");
    }
  };

  const calculatePaymentStats = (inv: Invoice) => {
    const list = paymentsMap[inv.HoaDonID] || [];
    const totalPaid = list.reduce((sum, p) => sum + p.SoTien, 0);
    const remain = inv.SoTien - totalPaid;
    const percent = inv.SoTien > 0 ? Math.floor((totalPaid / inv.SoTien) * 100) : 0;
    return { list, totalPaid, remain, percent };
  };

  {loading && <div className="loading">Đang tải...</div>}
  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>🧾 Quản lý hóa đơn</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm hóa đơn..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd} style={{ background: '#007bff' }}>
            Thêm hóa đơn
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr style={{ background: '#007bff', color: '#fff' }}>
            <th>ID</th>
            <th>Hợp đồng</th>
            <th>Số tiền</th>
            <th>Ngày phát hành</th>
            <th>Thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((i) => {
            const hd = hopDongMap[i.HopDongID];
            const stats = calculatePaymentStats(i);

            return (
              <tr key={i.HoaDonID}>
                <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>{formatID(i.HoaDonID)}</td>
                <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                  {hd ? hd.MaHopDong || `HD${hd.HopDongID}` : i.HopDongID}
                </td>
                <td style={{ verticalAlign: 'top', paddingTop: '15px', fontWeight: 'bold' }}>
                  {formatCurrency(i.SoTien)}
                </td>
                <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                  {i.NgayLap ? new Date(i.NgayLap).toISOString().split('T')[0] : "-"}
                </td>

                {/* CỘT THANH TOÁN */}
                <td style={{ textAlign: 'left', minWidth: '350px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>
                      {formatCurrency(stats.totalPaid)}
                    </strong>
                    <span style={{ color: '#888' }}> / {formatCurrency(i.SoTien)}</span>
                  </div>
                  
                  {stats.percent >= 100 ? (
                    <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>
                      100% đã thanh toán ✓
                    </div>
                  ) : (
                    <div style={{ color: '#d97706', fontWeight: 'bold', fontSize: '13px', marginBottom: '10px' }}>
                      {stats.percent}% đã thanh toán <span style={{ color: '#888', fontWeight: 'normal' }}>(còn {formatCurrency(stats.remain)})</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    <button 
                      onClick={() => handleOpenAddPayment(i)}
                      style={{ background: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      + Thêm thanh toán
                    </button>
                    {stats.list.length > 0 && (
                      <button 
                        onClick={() => handleOpenManagePayment(i)}
                        style={{ background: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Quản lý ({stats.list.length})
                      </button>
                    )}
                  </div>

                  {stats.list.length > 0 && (
                    <div style={{ maxHeight: '120px', overflowY: 'auto', borderTop: '1px dashed #ccc', paddingTop: '10px', paddingRight: '5px' }}>
                      {stats.list.slice(0, 5).map(p => (
                         <div key={p.ThanhToanID} style={{ marginBottom: '10px' }}>
                           <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{formatCurrency(p.SoTien)}</div>
                           <div style={{ fontSize: '11px', color: '#666' }}>
                             {p.PhuongThuc} • {p.ThoiGian ? new Date(p.ThoiGian).toLocaleString('vi-VN') : ''}
                           </div>
                         </div>
                      ))}
                    </div>
                  )}
                </td>

                <td style={{ verticalAlign: 'top', paddingTop: '15px' }}>
                  <button className="btn-edit" onClick={() => handleOpenEdit(i)} style={{ background: '#fff', color: '#333', border: '1px solid #ccc', fontSize: '12px', padding: '4px 8px' }}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(i.HoaDonID)} style={{ background: '#fff', color: '#333', border: '1px solid #ccc', fontSize: '12px', padding: '4px 8px' }}>Xóa</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* --- ADD INVOICE MODAL --- */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEdit ? "✏️ Sửa hóa đơn" : "➕ Thêm hóa đơn"}</h3>

            <label>Hợp đồng *</label>
            <select name="HopDongID" value={form.HopDongID} onChange={handleChange}>
              <option value="">-- Chọn hợp đồng --</option>
              {hopDongs.map((hd) => (
                <option key={hd.HopDongID} value={hd.HopDongID}>
                  {hd.MaHopDong || `HD${hd.HopDongID}`}
                </option>
              ))}
            </select>

            <label>Số tiền *</label>
            <input type="number" name="SoTien" value={form.SoTien} onChange={handleChange} />

            <label>Ngày lập *</label>
            <input type="date" name="NgayLap" value={form.NgayLap} onChange={handleChange} />

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmit}>{isEdit ? "Cập nhật" : "Thêm"}</button>
              <button className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ADD PAYMENT MODAL --- */}
      {showAddPaymentModal && activeInvoice && (
        <div className="modal">
          <div className="modal-content">
            <h3 style={{ fontSize: '22px' }}>
              Thêm thanh toán – Hóa đơn {formatID(activeInvoice.HoaDonID)}
            </h3>
            
            <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Hóa đơn: {formatID(activeInvoice.HoaDonID)}</div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Tổng tiền: {formatCurrency(activeInvoice.SoTien)}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Đã thu: {formatCurrency(calculatePaymentStats(activeInvoice).totalPaid)}
              </div>
              <div style={{ fontSize: '14px', color: '#e74c3c', fontWeight: 'bold' }}>
                Còn lại: {formatCurrency(calculatePaymentStats(activeInvoice).remain < 0 ? 0 : calculatePaymentStats(activeInvoice).remain)}
              </div>
            </div>

            <label>Số tiền thanh toán (đ) *</label>
            <input type="number" name="SoTien" value={paymentForm.SoTien} onChange={handlePaymentChange} autoFocus />

            <label>Phương thức</label>
            <input type="text" name="PhuongThuc" value={paymentForm.PhuongThuc} onChange={handlePaymentChange} placeholder="Tiền mặt, chuyển khoản..." />

            <label>Thời gian</label>
            <input type="datetime-local" name="ThoiGian" value={paymentForm.ThoiGian} onChange={handlePaymentChange} />

            <div className="modal-actions">
              <button className="btn-submit" onClick={handleSubmitPayment}>Lưu</button>
              <button className="btn-cancel" onClick={() => setShowAddPaymentModal(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MANAGE PAYMENT MODAL --- */}
      {showManagePaymentModal && activeInvoice && (
        <div className="modal">
          <div className="modal-content" style={{ width: '550px' }}>
            <h3 style={{ fontSize: '22px' }}>
              Quản lý thanh toán – Hóa đơn {formatID(activeInvoice.HoaDonID)}
            </h3>

            <div style={{ background: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Hóa đơn: {formatID(activeInvoice.HoaDonID)}</div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Tổng tiền: {formatCurrency(activeInvoice.SoTien)}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                Đã thu: {formatCurrency(calculatePaymentStats(activeInvoice).totalPaid)}
              </div>
              <div style={{ fontSize: '14px', color: '#28a745', fontWeight: 'bold' }}>
                Còn lại: {formatCurrency(calculatePaymentStats(activeInvoice).remain < 0 ? 0 : calculatePaymentStats(activeInvoice).remain)}
              </div>
            </div>

            <button style={{ width: '100%', background: '#34495e', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', marginBottom: '15px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>In hóa đơn</button>

            <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
              {paymentsMap[activeInvoice.HoaDonID]?.map(p => (
                <div key={p.ThanhToanID} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{formatCurrency(p.SoTien)}</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {p.PhuongThuc} {p.ThoiGian ? `• ${new Date(p.ThoiGian).toLocaleString('vi-VN')}` : ''}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePayment(p.ThanhToanID, activeInvoice.HoaDonID)}
                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              {(!paymentsMap[activeInvoice.HoaDonID] || paymentsMap[activeInvoice.HoaDonID].length === 0) && (
                 <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>Chưa có lịch sử thanh toán nào.</div>
              )}
            </div>

            <button 
               onClick={() => { setShowManagePaymentModal(false); handleOpenAddPayment(activeInvoice); }}
               style={{ width: '100%', background: '#2ecc71', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
            >
              + Thêm thanh toán mới
            </button>
            <button 
              className="btn-submit" 
              onClick={() => setShowManagePaymentModal(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Invoices;