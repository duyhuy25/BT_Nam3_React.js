import {
  getPaymentsByInvoiceId,
  createPayment,
  deletePaymentById
} from "../repositories/paymentRepositories";

export const fetchPaymentsByInvoiceIdService = async (hoaDonId: number) => {
  return await getPaymentsByInvoiceId(hoaDonId);
};

export const addPaymentService = async (data: any) => {
  return await createPayment(data);
};

export const removePaymentService = async (id: number) => {
  return await deletePaymentById(id);
};
