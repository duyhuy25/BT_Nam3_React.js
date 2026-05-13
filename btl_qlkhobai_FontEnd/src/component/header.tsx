import "./header.css";

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="banner">
      <div className="banner-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
          alt="logo"
          className="logo"
        />
        <h2>Hệ thống Quản lý Logistics</h2>
      </div>

      <div className="banner-right">
        {user ? (
          <div className="user-info">
            <span className="user-name">👤 {user.HoTen || user.Username}</span>
            <button className="btn-logout" onClick={onLogout}>Đăng xuất</button>
          </div>
        ) : (
          <a href="login">Đăng nhập</a>
        )}
      </div>
    </header>
  );
};

export default Header;