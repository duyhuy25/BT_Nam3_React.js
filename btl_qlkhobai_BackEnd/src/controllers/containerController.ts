import { Request, Response } from "express";
import { fetchContainer } from "../services/containerService";

export const getContainers = async (req: Request, res: Response) => {
  try {
    const data = await fetchContainer();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};