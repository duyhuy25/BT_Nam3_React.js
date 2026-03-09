import { Request, Response } from "express";
import { fetchHistory } from "../services/containerHistoryService";

export const getContainerHistory = async (req: Request, res: Response) => {

  try {

    const data = await fetchHistory();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};