import { getAllContract } from "../repositories/contractRepositories";

export const fetchContract = async () => {
  return await getAllContract();
};