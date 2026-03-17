import { useState } from "react";
import "./sidebar.css";

interface Props {
  onSelect: (module: string) => void;
}

const Sidebar = ({ onSelect }: Props) => {

  const [openMenu,setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu:string)=>{
    setOpenMenu(openMenu === menu ? null : menu);
  }

  return (

    <div className="sidebar">
      <h2>Danh mục</h2>
      <ul className="tree-menu">
        <li>
          <div
            className="menu-toggle"
            onClick={()=>toggleMenu("container")}
          >
            📦 Quản lý Container
          </div>
          {openMenu==="container" && (
            <ul className="sub-menu">
              <li onClick={()=>onSelect("containers")}>
                Danh sách Container
              </li>
              <li onClick={()=>onSelect("containerhistory")}>
                Lịch sử Container
              </li>
              <li onClick={()=>onSelect("itemtypes")}>
                Loại hàng
              </li>
            </ul>
          )}
        </li>
        <li>

          <div
            className="menu-toggle"
            onClick={()=>toggleMenu("warehouse")}
          >
            🏭 Quản lý Kho
          </div>

          {openMenu==="warehouse" && (
            <ul className="sub-menu">

              <li onClick={()=>onSelect("warehouses")}>
                Kho lưu trữ
              </li>
            </ul>
          )}

        </li>
        <li>
          <div
            className="menu-toggle"
            onClick={()=>toggleMenu("transport")}
          >
            🚚 Quản lý Vận chuyển
          </div>
          {openMenu==="transport" && (
            <ul className="sub-menu">
              <li onClick={()=>onSelect("vehicles")}>
                Phương tiện
              </li>
              <li onClick={()=>onSelect("trips")}>
                Chuyến đi
              </li>
              <li onClick={()=>onSelect("ports")}>
                Cảng
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="menu-toggle"
            onClick={()=>toggleMenu("customer")}
            >
            👥 Quản lý Khách hàng
          </div>
          {openMenu==="customer" && (
            <ul className="sub-menu">
              <li onClick={()=>onSelect("customers")}>
                Khách hàng
              </li>
              <li onClick={()=>onSelect("contracts")}>
                Hợp đồng
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="menu-toggle"
            onClick={()=>toggleMenu("finance")}
          >
            💰 Quản lý Tài chính
          </div>
          {openMenu==="finance" && (
            <ul className="sub-menu">
              <li onClick={()=>onSelect("costs")}>
                Chi phí
              </li>
              <li onClick={()=>onSelect("invoices")}>
                Hóa đơn
              </li>
            </ul>
          )}
        </li>
        <li>
          <div
            className="menu-toggle"
            onClick={()=>toggleMenu("users")}
          >
            👤 Người dùng
          </div>
          {openMenu==="users" && (
            <ul className="sub-menu">
              <li onClick={()=>onSelect("users")}>
                Quản lý tài khoản
              </li>
            </ul>
          )}

          </li>
          <li>
            <div
              className="menu-toggle"
              onClick={()=>onSelect("dashboard")}
            >
              📊 Báo cáo thống kê
            </div>
          </li>
      </ul>
    </div>
  );
};

export default Sidebar;