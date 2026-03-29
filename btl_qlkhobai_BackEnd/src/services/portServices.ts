import {
  getAllPort,
  createPort,
  updatePortById,
  deletePortById,
  searchPortByKeyword
} from "../repositories/portRepositories";

export const fetchPort = async () => {
  return await getAllPort();
};

export const addPortService = async (data: any) => {
  return await createPort(data);
};

export const updatePortService = async (id: number, data: any) => {
  return await updatePortById(id, data);
};

export const deletePortService = async (id: number) => {
  return await deletePortById(id);
};

export const searchPortService = async (keyword: string) => {
  return await searchPortByKeyword(keyword);
};