import { Request, Response } from "express";
import {
  fetchVehicle,
  addVehicleService,
  updateVehicleService,
  deleteVehicleService,
  searchVehicleService,
} from "../services/vehicleServices";

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const data = await fetchVehicle();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addVehicle = async (req: Request, res: Response) => {
  try {
    await addVehicleService(req.body);
    res.status(201).json({ message: "Thêm phương tiện thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    await updateVehicleService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    await deleteVehicleService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchVehicle = async (req: Request, res: Response) => {
  try {
    const keyword = (req.query.search as string) || "";
    const data = await searchVehicleService(keyword);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};