import "./header.css";

const Header = () => {
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
        <a href="login">Đăng nhập</a>
      </div>

    </header>
  );
};

export default Header;