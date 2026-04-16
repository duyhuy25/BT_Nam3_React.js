import {
  getAllWarehouse,
  createWarehouse,
  updateWarehouseById,
  deleteWarehouseById,
  searchWarehouseByKeyword,
} from "../repositories/warehousesRepository";

export const fetchWarehouse = async () => {
  return await getAllWarehouse();
};

export const addWarehouseService = async (data: any) => {
  if (!data.TenKho || !data.SucChua) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  return await createWarehouse(data);
};

export const updateWarehouseService = async (id: number, data: any) => {
  const result = await updateWarehouseById(id, data);

  if (result.rowsAffected[0] === 0) {
    throw new Error("Không tìm thấy kho");
  }

  return result;
};

export const deleteWarehouseService = async (id: number) => {
  return await deleteWarehouseById(id);
};

export const searchWarehouseService = async (keyword: string) => {
  return await searchWarehouseByKeyword(keyword);
};