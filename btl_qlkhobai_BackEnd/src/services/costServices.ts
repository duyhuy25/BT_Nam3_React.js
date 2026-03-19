import { getAllCost } from "../repositories/costRepositories";

export const fetchCost = async () => {
  return await getAllCost();
};