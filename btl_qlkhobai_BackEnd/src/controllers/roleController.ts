import { Request, Response } from "express";
import { fetchAllRoles } from "../services/roleServices";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const data = await fetchAllRoles();
    res.json(data);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
