import { Request, Response } from "express";
import {
  fetchWarehouse,
  addWarehouseService,
  updateWarehouseService,
  deleteWarehouseService,
  searchWarehouseService,
} from "../services/warehouseServices";

export const getWarehouses = async (req: Request, res: Response) => {
  try {
    const data = await fetchWarehouse();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addWarehouse = async (req: Request, res: Response) => {
  try {
    await addWarehouseService(req.body);
    res.status(201).json({ message: "Thêm kho thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateWarehouse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    await updateWarehouseService(id, req.body);
    res.json({ message: "Cập nhật kho thành công" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWarehouse = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    await deleteWarehouseService(id);
    res.json({ message: "Xóa kho thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchWarehouse = async (req: Request, res: Response) => {
  try {
    const keyword = (req.query.search as string) || "";
    const data = await searchWarehouseService(keyword);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};