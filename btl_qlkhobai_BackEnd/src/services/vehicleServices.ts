import { getAllVehicle } from "../repositories/vehicleRepositories";

export const fetchVehicle = async () => {
  return await getAllVehicle();
};