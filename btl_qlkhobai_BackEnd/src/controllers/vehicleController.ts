import { Request, Response } from "express";
import { fetchVehicle } from "../services/vehicleServices";

export const getVehicle = async (req: Request, res: Response) => {

  try {

    const data = await fetchVehicle();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};