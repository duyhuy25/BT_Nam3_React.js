import { Request, Response } from "express";
import {
  fetchContract,
  addContractService,
  updateContractService,
  deleteContractService,
  searchContractService
} from "../services/contractServices";

export const getContracts = async (req: Request, res: Response) => {
  try {
    const data = await fetchContract();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addContract = async (req: Request, res: Response) => {
  try {
    const result = await addContractService(req.body);
    res.json({ message: (result as any).message || "Thêm hợp đồng thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await updateContractService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteContractService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchContracts = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    const data = await searchContractService(keyword);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};