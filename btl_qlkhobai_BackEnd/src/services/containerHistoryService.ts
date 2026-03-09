import { getAllHistory } from "../repositories/containerHistoryRepository";

export const fetchHistory = async () => {
  return await getAllHistory();
};