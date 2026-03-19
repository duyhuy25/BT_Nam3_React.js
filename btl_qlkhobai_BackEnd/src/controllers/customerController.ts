import { Request, Response } from "express";
import { fetchCustomer } from "../services/customerServices";

export const getCustomer = async (req: Request, res: Response) => {

  try {

    const data = await fetchCustomer();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};