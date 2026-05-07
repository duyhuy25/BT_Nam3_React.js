import {
  getAllContract,
  createContract,
  updateContractById,
  deleteContractById,
  searchContractByKeyword
} from "../repositories/contractRepositories";
import { createContainer } from "../repositories/containerRepository";
import { getReadyVehicle } from "../repositories/vehicleRepositories";

export const fetchContract = async () => {
  return await getAllContract();
};

import { createInvoice } from "../repositories/invoiceRepositories";

export const addContractService = async (data: any) => {
  const result = await createContract(data);
  if (result.recordset && result.recordset.length > 0) {
    const newHopDongID = result.recordset[0].HopDongID;
    
    // Auto-create invoice
    await createInvoice({
      HopDongID: newHopDongID,
      SoTien: data.GiaTri || 0,
      NgayLap: new Date(),
      PhanTramDaThanhToan: 0
    });

    // Auto-create container and assign vehicle if available
    const readyVehicle = await getReadyVehicle();
    
    await createContainer({
      HopDongID: newHopDongID,
      LoaiHangID: 1, // Default or pick first from DB if possible
      TrongLuong: 0,
      TrangThai: "Rỗng",
      PhuongTienID: readyVehicle ? readyVehicle.PhuongTienID : null
    });

    // We can return the vehicle info to notify frontend if needed
    if (!readyVehicle) {
      (result as any).message = "Hợp đồng đã tạo, nhưng không có xe rảnh để gán cho container.";
    }
  }
  return result;
};

export const updateContractService = async (id: number, data: any) => {
  return await updateContractById(id, data);
};

export const deleteContractService = async (id: number) => {
  return await deleteContractById(id);
};

export const searchContractService = async (keyword: string) => {
  return await searchContractByKeyword(keyword);
};