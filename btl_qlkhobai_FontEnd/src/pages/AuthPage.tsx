import React, { useState } from "react";
import "./AuthPage.css";

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    hoTen: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess(data);
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.username || !form.password || !form.hoTen) {
      setError("Vui lòng điền đầy đủ thông tin");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: form.username,
          PasswordHash: form.password,
          HoTen: form.hoTen,
          Email: form.email,
          RoleID: 1, // Default User role
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Đăng ký thành công! Mời bạn đăng nhập.");
        setIsLogin(true);
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Nhập username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Họ tên</label>
              <input
                type="text"
                name="hoTen"
                placeholder="Họ và tên"
                value={form.hoTen}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Email (Tùy chọn)</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="******"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <p>
              Chưa có tài khoản?{" "}
              <span onClick={() => setIsLogin(false)}>Đăng ký ngay</span>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{" "}
              <span onClick={() => setIsLogin(true)}>Đăng nhập</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
