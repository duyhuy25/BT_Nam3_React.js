import { Request, Response } from "express";
import { fetchCost } from "../services/costServices";

export const getCosts = async (req: Request, res: Response) => {

  try {

    const data = await fetchCost();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};