import { getAllInvoice } from "../repositories/invoiceRepositories";

export const fetchInvoice = async () => {
  return await getAllInvoice();
};