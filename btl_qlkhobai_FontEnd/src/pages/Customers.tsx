import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface Customer {
  KhachHangID: number;
  TenKH: string;
  DiaChi: string;
  SDT: string;
  Email: string;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const [form, setForm] = useState({
    TenKH: "",
    DiaChi: "",
    SDT: "",
    Email: "",
  });

  const fetchCustomers = useCallback(async (searchTerm: string = "") => {
    try {
      setLoading(true);

      const url = searchTerm.trim()
        ? `http://localhost:5000/api/customer/customer/search?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:5000/api/customer/customer";

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách khách hàng");

      const data = await res.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải khách hàng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCustomers(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, fetchCustomers]);

  const formatID = (id: number) => "KH" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      TenKH: "",
      DiaChi: "",
      SDT: "",
      Email: "",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: Customer) => {
    setIsEdit(true);
    setSelected(item);
    setForm({
      TenKH: item.TenKH,
      DiaChi: item.DiaChi,
      SDT: item.SDT,
      Email: item.Email,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.TenKH.trim()) {
      alert("Vui lòng nhập tên khách hàng");
      return;
    }

    if (!form.SDT.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    const body = { ...form };

    try {
      if (isEdit && selected) {
        await fetch(
          `http://localhost:5000/api/customer/customer/${selected.KhachHangID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
      } else {
        await fetch("http://localhost:5000/api/customer/addcustomer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setShowForm(false);
      fetchCustomers(search);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi lưu khách hàng");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/api/customer/customer/${id}`, {
        method: "DELETE",
      });

      fetchCustomers(search);
    } catch (err) {
      console.error(err);
      alert("Không thể xóa (có thể đang liên kết dữ liệu)");
    }
  };

  {loading && <div className="loading">Đang tải dữ liệu...</div>}
  {error && <div className="error">Lỗi: {error}</div>}

  return (
    <div>
      <div className="header">
        <h2>👥 Danh sách khách hàng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm khách hàng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm khách hàng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.KhachHangID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.KhachHangID)}</td>
              <td>{c.TenKH}</td>
              <td>{c.DiaChi || "-"}</td>
              <td>{c.SDT}</td>
              <td>{c.Email || "-"}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(c);
                  }}
                >
                  Sửa
                </button>

                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(c.KhachHangID);
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
            <h3>{isEdit ? "✏️ Sửa khách hàng" : "➕ Thêm khách hàng"}</h3>

            <label>Tên khách hàng *</label>
            <input
              name="TenKH"
              value={form.TenKH}
              onChange={handleChange}
            />

            <label>Địa chỉ</label>
            <input
              name="DiaChi"
              value={form.DiaChi}
              onChange={handleChange}
            />

            <label>Số điện thoại *</label>
            <input
              type="tel"
              name="SDT"
              value={form.SDT}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
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

export default Customers;