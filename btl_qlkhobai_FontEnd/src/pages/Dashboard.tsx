import React, { useEffect, useState } from "react";
import "./Pages.css";

interface Invoice {
  HoaDonID: number;
  HopDongID: number;
  SoTien: number;
  NgayLap: string;
}

interface Cost {
  ChiPhiID: number;
  SoTien: number;
  ThuKhachHang: string;
  NgayChi: string;
}

const Dashboard: React.FC = () => {

  const [tongDoanhThu, setTongDoanhThu] = useState(0);
  const [tongChiPhi, setTongChiPhi] = useState(0);
  const [chiPhiThuKH, setChiPhiThuKH] = useState(0);
  const [chiPhiNoiBo, setChiPhiNoiBo] = useState(0);
  const [doanhThuHomNay, setDoanhThuHomNay] = useState(0);
  const [chiPhiHomNay, setChiPhiHomNay] = useState(0);

  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);

  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {

    const fetchData = async () => {

      try {
        const invoices: Invoice[] = await fetch("http://localhost:5000/api/invoice/invoice")
          .then(res => res.json());

        const costs: Cost[] = await fetch("http://localhost:5000/api/cost/cost")
          .then(res => res.json());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalRevenue = invoices.reduce((sum, i) => sum + i.SoTien, 0);
        const totalCost = costs.reduce((sum, c) => sum + c.SoTien, 0);
        
        const billedCost = costs.filter(c => c.ThuKhachHang === "Có").reduce((sum, c) => sum + c.SoTien, 0);
        const internalCost = costs.filter(c => c.ThuKhachHang !== "Có").reduce((sum, c) => sum + c.SoTien, 0);

        const revenueToday = invoices.filter(i => {
          const d = new Date(i.NgayLap);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        }).reduce((sum, i) => sum + i.SoTien, 0);

        const costToday = costs.filter(c => {
          if (!c.NgayChi) return false;
          const d = new Date(c.NgayChi);
          d.setHours(0, 0, 0, 0);
          return d.getTime() === today.getTime();
        }).reduce((sum, c) => sum + c.SoTien, 0);

        setTongDoanhThu(totalRevenue);
        setTongChiPhi(totalCost);
        setChiPhiThuKH(billedCost);
        setChiPhiNoiBo(internalCost);
        setDoanhThuHomNay(revenueToday);
        setChiPhiHomNay(costToday);

        const monthMap: any = {};
        const yearMap: any = {};

        invoices.forEach(i => {
          const date = new Date(i.NgayLap);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;

          const monthKey = `${year}-${month}`;

          if (!monthMap[monthKey]) monthMap[monthKey] = 0;
          if (!yearMap[year]) yearMap[year] = 0;

          monthMap[monthKey] += i.SoTien;
          yearMap[year] += i.SoTien;
        });

        const monthArr = Object.keys(monthMap).map(k => ({
          thang: k,
          doanhThu: monthMap[k]
        }));

        const yearArr = Object.keys(yearMap).map(k => ({
          nam: k,
          doanhThu: yearMap[k]
        }));

        setMonthlyData(monthArr);
        setYearlyData(yearArr);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();

  }, []);

  const filteredMonth = monthlyData.filter(m =>
    yearFilter === "all" ? true : m.thang.startsWith(yearFilter)
  );

  return (
    <div>

      <div className="header">
        <h2>📊 Báo cáo thống kê</h2>
      </div>

      <div className="dashboard">

        <div className="card">
          <h4>💰 Tổng doanh thu</h4>
          <p>{tongDoanhThu.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>💸 Tổng chi phí</h4>
          <p>{tongChiPhi.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>📥 Chi phí thu khách</h4>
          <p>{chiPhiThuKH.toLocaleString()} VNĐ</p>
        </div>

        <div className="card">
          <h4>🏢 Chi phí nội bộ</h4>
          <p>{chiPhiNoiBo.toLocaleString()} VNĐ</p>
        </div>

      </div>

      <h3 style={{ marginTop: "30px" }}>🕒 Thống kê hôm nay</h3>
      <div className="dashboard">
        <div className="card today-card revenue">
          <h4>💵 Doanh thu hôm nay</h4>
          <p>{doanhThuHomNay.toLocaleString()} VNĐ</p>
        </div>
        <div className="card today-card cost">
          <h4>📉 Chi phí hôm nay</h4>
          <p>{chiPhiHomNay.toLocaleString()} VNĐ</p>
        </div>
      </div>

      <div style={{ margin: "20px 0" }}>
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="all">Tất cả năm</option>
          {yearlyData.map((y, index) => (
            <option key={index} value={y.nam}>{y.nam}</option>
          ))}
        </select>
      </div>

      <h3>📅 Doanh thu theo tháng</h3>

      <table>
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Doanh thu</th>
          </tr>
        </thead>

        <tbody>
          {filteredMonth.map((m, index) => (
            <tr key={index}>
              <td>{m.thang}</td>
              <td>{m.doanhThu.toLocaleString()} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "30px" }}>📆 Doanh thu theo năm</h3>

      <table>
        <thead>
          <tr>
            <th>Năm</th>
            <th>Doanh thu</th>
          </tr>
        </thead>

        <tbody>
          {yearlyData.map((y, index) => (
            <tr key={index}>
              <td>{y.nam}</td>
              <td>{y.doanhThu.toLocaleString()} VNĐ</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Dashboard;