import { Request, Response } from "express";
import {
  fetchContainer,
  createContainerService,
  updateContainerService,
  deleteContainerService
} from "../services/containerService";

export const getContainers = async (req: Request, res: Response) => {
  try {
    const data = await fetchContainer();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addContainer = async (req: Request, res: Response) => {
  try {
    await createContainerService(req.body);
    res.json({ message: "Thêm container thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateContainer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateContainerService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteContainer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteContainerService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};