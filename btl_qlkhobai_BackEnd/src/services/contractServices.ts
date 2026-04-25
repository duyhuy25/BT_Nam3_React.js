import {
  getAllContract,
  createContract,
  updateContractById,
  deleteContractById,
  searchContractByKeyword
} from "../repositories/contractRepositories";

export const fetchContract = async () => {
  return await getAllContract();
};

import { createInvoice } from "../repositories/invoiceRepositories";

export const addContractService = async (data: any) => {
  const result = await createContract(data);
  if (result.recordset && result.recordset.length > 0) {
    const newHopDongID = result.recordset[0].HopDongID;
    
    await createInvoice({
      HopDongID: newHopDongID,
      SoTien: data.GiaTri || 0,
      NgayLap: new Date(),
      PhanTramDaThanhToan: 0
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