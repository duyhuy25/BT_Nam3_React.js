import { Request, Response } from "express";
import {
  fetchPort,
  addPortService,
  updatePortService,
  deletePortService,
  searchPortService
} from "../services/portServices";

export const getPort = async (req: Request, res: Response) => {
  try {
    const data = await fetchPort();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addPort = async (req: Request, res: Response) => {
  try {
    await addPortService(req.body);
    res.json({ message: "Thêm cảng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updatePort = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updatePortService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deletePort = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deletePortService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchPort = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const data = await searchPortService(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};