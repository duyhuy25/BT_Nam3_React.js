import React,{useEffect,useState} from "react";
import "./Pages.css";

interface Contract{
  HopDongID:number
  KhachHang:string
  NgayKy:string
  NgayHetHan:string
  GiaTri:number
}

const Contracts = () =>{

  const [contracts,setContracts] = useState<Contract[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    fetch("http://localhost:5000/api/contracts")
    .then(res=>res.json())
    .then(data=>setContracts(data))

  },[])

  const filtered = contracts.filter(c =>
    c.KhachHang.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div>

      <div className="header">

        <h2>📄 Hợp đồng</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm hợp đồng..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <button className="btn-add">
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
            <th>Giá trị</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(c =>(

            <tr key={c.HopDongID}>

              <td>{c.HopDongID}</td>
              <td>{c.KhachHang}</td>
              <td>{new Date(c.NgayKy).toLocaleDateString()}</td>
              <td>{new Date(c.NgayHetHan).toLocaleDateString()}</td>
              <td>{c.GiaTri.toLocaleString()}</td>

              <td>
                <button className="btn-edit">Sửa</button>
                <button className="btn-delete">Xóa</button>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}

export default Contracts