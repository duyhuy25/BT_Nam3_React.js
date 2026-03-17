import { getAllItemtype } from "../repositories/itemtypeRepository";

export const fetchItemType = async () => {
  return await getAllItemtype();
};