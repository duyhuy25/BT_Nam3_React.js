import { Request, Response } from "express";
import { fetchItemType } from "../services/itemtypeServices";

export const getItemtypes = async (req: Request, res: Response) => {

  try {

    const data = await fetchItemType();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};