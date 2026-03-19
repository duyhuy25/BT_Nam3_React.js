import { Request, Response } from "express";
import { fetchTrip } from "../services/tripsServices";

export const getTrip = async (req: Request, res: Response) => {

  try {

    const data = await fetchTrip();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Lỗi server" });

  }

};