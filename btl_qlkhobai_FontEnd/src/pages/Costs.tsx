import React,{useEffect,useState} from "react"
import "./Pages.css"

interface Cost{
  ChiPhiID:number
  HopDongID:number
  ContainerID: number
  LoaiChiPhi:string
  SoTien:number
  ThuKhachHang: string  
}

const Costs = () =>{

  const [costs,setCosts] = useState<Cost[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    fetch("http://localhost:5000/api/cost/cost")
    .then(res=>res.json())
    .then(data=>setCosts(data))

  },[])

  const filtered = costs.filter(c =>
    c.LoaiChiPhi.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div>

      <div className="header">

        <h2>💰 Chi phí</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm chi phí..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <button className="btn-add">
            + Thêm chi phí
          </button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Hợp đồng</th>
            <th>Container</th>
            <th>Loại chi phí</th>
            <th>Số tiền</th>
            <th>Thu Khách Hàng</th>
            <th>Tác vụ</th>
          </tr>
        </thead> 
        <tbody>

          {filtered.map(c =>(

            <tr key={c.ChiPhiID}>

              <td>{c.ChiPhiID}</td>
              <td>{c.HopDongID}</td>
              <td>{c.ContainerID}</td>
              <td>{c.LoaiChiPhi}</td>
              <td>{c.SoTien.toLocaleString()}</td>
              <td>{c.ThuKhachHang}</td>

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

export default Costs