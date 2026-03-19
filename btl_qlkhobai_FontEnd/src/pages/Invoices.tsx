import React,{useEffect,useState} from "react"
import "./Pages.css"

interface Invoice{
  HoaDonID:number
  HopDongID:number
  SoTien:number
  NgayLap:string
  PhanTramDaThanhToan:string
}

const Invoices = () =>{

  const [invoices,setInvoices] = useState<Invoice[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    fetch("http://localhost:5000/api/invoice/invoice")
    .then(res=>res.json())
    .then(data=>setInvoices(data))

  },[])

  const filtered = invoices.filter(c =>
    c.HopDongID.toString().includes(search)
  )
  return(

    <div>

      <div className="header">

        <h2>🧾 Hóa đơn</h2>

        <div className="toolbar">

          <input
            className="search"
            placeholder="🔍 Tìm hóa đơn..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <button className="btn-add">
            + Thêm hóa đơn
          </button>

        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Hợp đồng</th>
            <th>Số tiền</th>
            <th>Ngày lập</th>
            <th>Phần Trăm Thanh toán</th>
            <th>Tác vụ</th>
          </tr>
        </thead>

        <tbody>

          {filtered.map(i =>(

            <tr key={i.HoaDonID}>

              <td>{i.HoaDonID}</td>
              <td>{i.HopDongID}</td>
              <td>{i.SoTien.toLocaleString()}</td>
              <td>{new Date(i.NgayLap).toLocaleDateString()}</td>
              <td>{i.PhanTramDaThanhToan}</td>

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

export default Invoices