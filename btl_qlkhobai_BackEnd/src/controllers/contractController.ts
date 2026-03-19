import { Request, Response } from "express";
import { fetchContract } from "../services/contractServices";

export const getContracts = async (req: Request, res: Response) => {

  try {

    const data = await fetchContract();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};