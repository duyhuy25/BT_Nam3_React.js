import { Request, Response } from "express";
import {
  fetchItemType,
  addItemTypeService,
  updateItemTypeService,
  deleteItemTypeService,
  searchItemTypeService
} from "../services/itemtypeServices";

export const getItemtypes = async (req: Request, res: Response) => {
  try {
    const data = await fetchItemType();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addItemtype = async (req: Request, res: Response) => {
  try {
    await addItemTypeService(req.body);
    res.json({ message: "Thêm loại hàng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateItemtype = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateItemTypeService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteItemtype = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteItemTypeService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchItemtype = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchItemTypeService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};