import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import "./Pages.css";

interface User {
  UserID: number;
  Username: string;
  PasswordHash: string;
  HoTen: string;
  Email: string;
  TrangThai: string;
  TenVaiTro?: string;
  RoleID: number | null | undefined;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const [form, setForm] = useState({
    Username: "",
    PasswordHash: "",
    HoTen: "",
    Email: "",
    TrangThai: "Hoạt động",
    RoleID: "",
  });

  const [visibleUserIds, setVisibleUserIds] = useState<Set<number>>(new Set());

  const fetchUsers = useCallback(async (searchTerm: string = "") => {
    try {
      const url = searchTerm.trim()
        ? `http://localhost:5000/api/user/user/search?search=${encodeURIComponent(searchTerm)}`
        : `http://localhost:5000/api/user/user`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Lỗi tải danh sách người dùng");

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);


  useEffect(() => {
    setLoading(true);
    fetchUsers().finally(() => setLoading(false));
  }, [fetchUsers]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(search);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search, fetchUsers]);

  const formatID = (id: number) => "USR" + id.toString().padStart(3, "0");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setSelected(null);
    setForm({
      Username: "",
      PasswordHash: "",
      HoTen: "",
      Email: "",
      TrangThai: "Hoạt động",
      RoleID: "1",
    });

    setShowForm(true);
  };

  const handleOpenEdit = (item: User) => {
    setIsEdit(true);
    setSelected(item);

    setForm({
      Username: item.Username || "",
      PasswordHash: "",
      HoTen: item.HoTen || "",
      Email: item.Email || "",
      TrangThai: item.TrangThai || "Hoạt động",
      RoleID: (item.RoleID ?? 1).toString(),
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.Username || !form.HoTen || !form.RoleID) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Username, Họ tên, RoleID)!");
      return;
    }

    const payload: any = {
      Username: form.Username,
      HoTen: form.HoTen,
      Email: form.Email || null,
      TrangThai: form.TrangThai || "Hoạt động",
      RoleID: Number(form.RoleID),
    };

    if (form.PasswordHash?.trim()) {
      payload.PasswordHash = form.PasswordHash;
    }

    try {
      let res: Response;

      if (isEdit && selected) {
        res = await fetch(`http://localhost:5000/api/user/user/${selected.UserID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        if (!form.PasswordHash?.trim()) {
          alert("Vui lòng nhập mật khẩu khi thêm người dùng mới!");
          return;
        }
        res = await fetch("http://localhost:5000/api/user/adduser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Lỗi server");
      }

      alert(isEdit ? "Cập nhật thành công!" : "Thêm người dùng thành công!");
      setShowForm(false);
      fetchUsers(search);   
    } catch (err: any) {
      console.error(err);
      alert("Lỗi: " + (err.message || "Vui lòng thử lại"));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      alert("Xóa thành công!");
      fetchUsers(search);
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  const togglePasswordVisibility = (userId: number) => {
    setVisibleUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const maskPassword = (password: string): string => password ? "*".repeat(8) : "Chưa có";

  if (error) return <div className="error">Lỗi: {error}</div>;

  return (
    <div>
      <div className="header">
        <h2>👤 Danh sách người dùng</h2>

        <div className="toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm người dùng..."
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"          
          />

          <button className="btn-add" onClick={handleOpenAdd}>
            + Thêm người dùng
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tài khoản</th>
            <th>Mật khẩu</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Vai trò</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.UserID} onClick={() => handleOpenEdit(u)}>
              <td>{formatID(u.UserID)}</td>
              <td>{u.Username}</td>
              <td className="password-cell">
                <div className="password-display">
                  <span>
                    {visibleUserIds.has(u.UserID) 
                      ? (u.PasswordHash || "Chưa có") 
                      : maskPassword(u.PasswordHash)}
                  </span>
                  <span 
                    className="password-toggle-table" 
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePasswordVisibility(u.UserID);
                    }}
                  >
                    {visibleUserIds.has(u.UserID) ? "🙈" : "👁️"}
                  </span>
                </div>
              </td>
              <td>{u.HoTen}</td>
              <td>{u.Email || "-"}</td>
              <td>{u.TrangThai}</td>
              <td>{u.TenVaiTro || u.RoleID || "-"}</td>

              <td>
                <button
                  className="btn-edit"
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(u); }}
                >
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => { e.stopPropagation(); handleDelete(u.UserID); }}
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
            <h3>{isEdit ? "✏️ Sửa" : "➕ Thêm"} người dùng</h3>

            <input 
              name="Username" 
              value={form.Username} 
              onChange={handleChange} 
              placeholder="Tài khoản" 
            />

            <input 
              name="PasswordHash" 
              type="password"
              value={form.PasswordHash} 
              onChange={handleChange} 
              placeholder={isEdit ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"} 
            />

            <input name="HoTen" value={form.HoTen} onChange={handleChange} placeholder="Họ tên" />
            <input name="Email" value={form.Email} onChange={handleChange} placeholder="Email" />

            <select name="TrangThai" value={form.TrangThai} onChange={handleChange}>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Khóa">Khóa</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
            </select>

            <input 
              name="RoleID" 
              type="number" 
              value={form.RoleID} 
              onChange={handleChange} 
              placeholder="RoleID (Vai trò)" 
              min="1"
            />

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

export default Users;