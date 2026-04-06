import {
  getAllVehicle,
  createVehicle,
  updateVehicleById,
  deleteVehicleById,
  searchVehicleByKeyword,
} from "../repositories/vehicleRepositories";

export const fetchVehicle = async () => {
  return await getAllVehicle();
};

export const addVehicleService = async (data: any) => {
  if (!data.LoaiPhuongTien || !data.BienSo) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  return await createVehicle(data);
};

export const updateVehicleService = async (id: number, data: any) => {
  return await updateVehicleById(id, data);
};

export const deleteVehicleService = async (id: number) => {
  return await deleteVehicleById(id);
};

export const searchVehicleService = async (keyword: string) => {
  return await searchVehicleByKeyword(keyword);
};