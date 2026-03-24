import { Request, Response } from "express";
import {
  fetchHistory,
  createHistoryService,
  updateHistoryService,
  deleteHistoryService,
  searchHistoryService,
} from "../services/containerHistoryService";

export const getContainerHistorys = async (req: Request, res: Response) => {
  try {
    const data = await fetchHistory();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addContainerHistory = async (req: Request, res: Response) => {
  try {
    await createHistoryService(req.body);
    res.json({ message: "Thêm lịch sử container thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateContainerHistory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateHistoryService(id, req.body);
    res.json({ message: "Cập nhật lịch sử thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteContainerHistory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteHistoryService(id);
    res.json({ message: "Xóa lịch sử thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchContainerHistory = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const data = await searchHistoryService(String(search || ""));
    res.json(data);
  } catch (error: any) {
    console.error("=== SEARCH HISTORY ERROR ===", error);
    res.status(500).json({
      message: "Lỗi khi tìm kiếm lịch sử container",
      detail: error.message,
    });
  }
};