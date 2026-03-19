import { getAllTrip } from "../repositories/tripsRepositories";

export const fetchTrip = async () => {
  return await getAllTrip();
};