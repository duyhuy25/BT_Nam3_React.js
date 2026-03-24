import {
  getAllContainerHistory,
  updateHistory,
  createHistory,
  deleteHistory,
  searchHistory,
} from "../repositories/containerHistoryRepository";

export const fetchHistory = async () => {
  return await getAllContainerHistory();
};

export const createHistoryService = async (data: any) => {
  return await createHistory(data);
};

export const updateHistoryService = async (id: number, data: any) => {
  return await updateHistory(id, data);
};

export const deleteHistoryService = async (id: number) => {
  return await deleteHistory(id);
};

export const searchHistoryService = async (search: string) => {
  return await searchHistory(search);
};