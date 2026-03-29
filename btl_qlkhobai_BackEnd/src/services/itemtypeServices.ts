import {
  getAllItemtype,
  createItemtype,
  updateItemtypeById,
  deleteItemtypeById,
  searchItemtypeByKeyword
} from "../repositories/itemtypeRepository";

export const fetchItemType = async () => {
  return await getAllItemtype();
};

export const addItemTypeService = async (data: any) => {
  return await createItemtype(data);
};

export const updateItemTypeService = async (id: number, data: any) => {
  return await updateItemtypeById(id, data);
};

export const deleteItemTypeService = async (id: number) => {
  return await deleteItemtypeById(id);
};

export const searchItemTypeService = async (keyword: string) => {
  return await searchItemtypeByKeyword(keyword);
};