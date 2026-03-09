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

      </ul>

    </div>

  );
};

export default Sidebar;