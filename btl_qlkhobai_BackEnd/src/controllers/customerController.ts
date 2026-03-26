import { Request, Response } from "express";
import {
  fetchCustomer,
  addCustomerService,
  updateCustomerService,
  deleteCustomerService,
  searchCustomerService
} from "../services/customerServices";

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const data = await fetchCustomer();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addCustomer = async (req: Request, res: Response) => {
  try {
    await addCustomerService(req.body);
    res.json({ message: "Thêm khách hàng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateCustomerService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteCustomerService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchCustomer = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchCustomerService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};