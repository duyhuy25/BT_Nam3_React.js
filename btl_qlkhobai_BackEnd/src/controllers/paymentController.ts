import { Request, Response } from "express";
import {
  fetchPaymentsByInvoiceIdService,
  addPaymentService,
  removePaymentService
} from "../services/paymentServices";

export const getPayments = async (req: Request, res: Response) => {
  try {
    const hoaDonId = Number(req.params.hoaDonId);
    if (!hoaDonId) {
      return res.status(400).json({ message: "Thiếu HoaDonID" });
    }
    const data = await fetchPaymentsByInvoiceIdService(hoaDonId);
    res.json(data);
  } catch (error) {
    console.error("Error getPayments:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addPayment = async (req: Request, res: Response) => {
  try {
    await addPaymentService(req.body);
    res.json({ message: "Thêm thanh toán thành công" });
  } catch (error) {
    console.error("Error addPayment:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).json({ message: "Thiếu ThanhToanID" });
    }
    await removePaymentService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Error deletePayment:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
