import {
  getAllContainer,
  createContainer,
  updateContainer,
  deleteContainer
} from "../repositories/containerRepository";

export const fetchContainer = async () => {
  return await getAllContainer();
};

export const createContainerService = async (data: any) => {
  return await createContainer(data);
};

export const updateContainerService = async (id: number, data: any) => {
  return await updateContainer(id, data);
};

export const deleteContainerService = async (id: number) => {
  return await deleteContainer(id);
};