import React, { useEffect, useState } from "react";
import "./Pages.css";
import FormInput from "../component/FormInput";

interface Container {
  ContainerID: number;
  HopDongID: number;
  LoaiHangID: string;
  TrongLuong: number;
  TrangThai: string;
  KhoID: string;
  PhuongTienID: string;
  ChuyenDiID: string;
}

const Containers: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    LoaiHangID: "",
    TrongLuong: "",
    TrangThai: "",
    KhoID: "",
    PhuongTienID: "",
    HopDongID: "",
    ChuyenDiID: ""
  });

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/container/container");
      const data = await res.json();
      setContainers(data);
    } catch (err) {
      console.error("Lỗi load:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAdd = async () => {
    const newItem = {
      ...form,
      TrongLuong: Number(form.TrongLuong),
      HopDongID: Number(form.HopDongID)
    };

    try {
      await fetch("http://localhost:5000/api/container/container", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      });

      fetchData();

      setForm({
        LoaiHangID: "",
        TrongLuong: "",
        TrangThai: "",
        KhoID: "",
        PhuongTienID: "",
        HopDongID: "",
        ChuyenDiID: ""
      });

    } catch (err) {
      console.error("Lỗi thêm:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await fetch(`http://localhost:5000/api/container/container/${id}`, {
        method: "DELETE"
      });

      fetchData();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  const formatID = (id: number) =>
    "CTN" + id.toString().padStart(3, "0");

  const filtered = containers.filter(c =>
    formatID(c.ContainerID).includes(search)
  );

  return (
    <div>
      <h2>📦 Danh sách Container</h2>
      <div className="form">
        <FormInput label="Loại hàng" name="LoaiHangID" value={form.LoaiHangID} onChange={handleChange} />
        <FormInput label="Trọng lượng" name="TrongLuong" value={form.TrongLuong} onChange={handleChange} />
        <FormInput label="Trạng thái" name="Trạng thái" value={form.TrangThai} onChange={handleChange} />
        <FormInput label="Kho" name="KhoID" value={form.KhoID} onChange={handleChange} />
        <FormInput label="Phương tiện" name="PhuongTienID" value={form.PhuongTienID} onChange={handleChange} />
        <FormInput label="Hợp đồng" name="HopDongID" value={form.HopDongID} onChange={handleChange} />
        <FormInput label="Chuyến đi" name="ChuyenDiID" value={form.ChuyenDiID} onChange={handleChange} />

        <button onClick={handleAdd}>+ Thêm</button>
      </div>
      <input
        placeholder="🔍 Tìm ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại hàng</th>
            <th>Trọng lượng</th>
            <th>Trạng thái</th>
            <th>Kho</th>
            <th>Phương tiện</th>
            <th>Hợp đồng</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((c) => (
            <tr key={c.ContainerID}>
              <td>{formatID(c.ContainerID)}</td>
              <td>{c.LoaiHangID}</td>
              <td>{c.TrongLuong}</td>
              <td>{c.TrangThai}</td>
              <td>{c.KhoID}</td>
              <td>{c.PhuongTienID}</td>
              <td>{c.HopDongID}</td>
              <td>
                <button onClick={() => handleDelete(c.ContainerID)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Containers;