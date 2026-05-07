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

    // Auto-create container without fixed vehicle assignment
    await createContainer({
      HopDongID: newHopDongID,
      LoaiHangID: 1, // Default
      TrongLuong: 0,
      TrangThai: "Rỗng",
      PhuongTienID: null
    });
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