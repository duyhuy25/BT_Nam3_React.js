import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Contract {
  HopDongID: number;
  KhachHangID: number;
  NgayKy: string;
  NgayHetHan: string;
  LoaiDichVu: string;
  GiaTri: number;
  TrangThai: string;
}

const Contracts: React.FC = () => {

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<Contract | null>(null);

  const [form, setForm] = useState({
    KhachHangID: "",
    NgayKy: "",
    NgayHetHan: "",
    LoaiDichVu: "",
    GiaTri: "",
    TrangThai: ""
  });

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api/contract/contract");
    const data = await res.json();
    setContracts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatID = (id: number) =>
    "HD" + id.toString().padStart(3, "0");

  const filtered = contracts.filter((c) =>
    formatID(c.HopDongID).includes(search)
  );

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
      KhachHangID: "",
      NgayKy: "",
      NgayHetHan: "",
      LoaiDichVu: "",
      GiaTri: "",
      TrangThai: ""
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: Contract) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      KhachHangID: item.KhachHangID.toString(),
      NgayKy: item.NgayKy,
      NgayHetHan: item.NgayHetHan,
      LoaiDichVu: item.LoaiDichVu,
      GiaTri: item.GiaTri.toString(),
      TrangThai: item.TrangThai
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      KhachHangID: Number(form.KhachHangID),
      GiaTri: Number(form.GiaTri)
    };

    if (isEdit && selected) {
      await fetch(
        `http://localhost:5000/api/contract/contract/${selected.HopDongID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );
    } else {
      await fetch("http://localhost:5000/api/contract/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    await fetch(`http://localhost:5000/api/contract/contract/${id}`, {
      method: "DELETE"
    });

    fetchData();
  };

  return (
    <div>
      <div className="header">
        <h2>📄 Danh sách hợp đồng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm hợp đồng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm hợp đồng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày ký</th>
            <th>Ngày hết hạn</th>
            <th>Loại dịch vụ</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.HopDongID} onClick={() => handleOpenEdit(c)}>
              <td>{formatID(c.HopDongID)}</td>
              <td>{c.KhachHangID}</td>
              <td>{new Date(c.NgayKy).toLocaleDateString()}</td>
              <td>{new Date(c.NgayHetHan).toLocaleDateString()}</td>
              <td>{c.LoaiDichVu}</td>
              <td>{c.GiaTri.toLocaleString()}</td>
              <td>{c.TrangThai}</td>

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
                    handleDelete(c.HopDongID);
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} hợp đồng</h3>

            <input name="KhachHangID" placeholder="Khách hàng" value={form.KhachHangID} onChange={handleChange} />
            <input name="NgayKy" placeholder="Ngày ký" value={form.NgayKy} onChange={handleChange} />
            <input name="NgayHetHan" placeholder="Ngày hết hạn" value={form.NgayHetHan} onChange={handleChange} />
            <input name="LoaiDichVu" placeholder="Loại dịch vụ" value={form.LoaiDichVu} onChange={handleChange} />
            <input name="GiaTri" placeholder="Giá trị" value={form.GiaTri} onChange={handleChange} />
            <input name="TrangThai" placeholder="Trạng thái" value={form.TrangThai} onChange={handleChange} />

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

export default Contracts;