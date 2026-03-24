import { Request, Response } from "express";
import {
  fetchContainer,
  createContainerService,
  updateContainerService,
  deleteContainerService,
  searchContainersService,
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

export const searchContainers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const data = await searchContainersService(String(search || ""));
    res.json(data);
  } catch (error: any) {
    console.error("=== SEARCH ERROR ===", error);
    res.status(500).json({ 
      message: "Lỗi khi tìm kiếm container",
      detail: error.message 
    });
  }
};