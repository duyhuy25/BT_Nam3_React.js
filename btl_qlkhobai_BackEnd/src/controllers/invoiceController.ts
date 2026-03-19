import { Request, Response } from "express";
import { fetchInvoice } from "../services/invoiceServices";

export const getInvoice = async (req: Request, res: Response) => {

  try {

    const data = await fetchInvoice();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};