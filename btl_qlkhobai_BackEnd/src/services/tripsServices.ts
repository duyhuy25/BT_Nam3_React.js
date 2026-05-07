import {
  getAllTrip,
  createTrip,
  updateTripById,
  deleteTripById,
  searchTripByKeyword
} from "../repositories/tripsRepositories";

import { getVehicleById, updateVehicleById } from "../repositories/vehicleRepositories";

export const fetchTrip = async () => {
  return await getAllTrip();
};

export const addTripService = async (data: any) => {
  return await createTrip(data);
};

export const updateTripService = async (id: number, data: any) => {
  const result = await updateTripById(id, data);
  
  // Side effect: Update vehicle status based on trip status
  if (data.PhuongTienID) {
    const vehicle = await getVehicleById(data.PhuongTienID);
    if (vehicle) {
      let newVehicleStatus = vehicle.TrangThai;
      if (data.TrangThai === 'Hoàn thành' || data.TrangThai === 'Hủy') {
        newVehicleStatus = 'Sẵn sàng';
      } else if (data.TrangThai === 'Đang chạy') {
        newVehicleStatus = 'Đang chạy';
      }

      if (newVehicleStatus !== vehicle.TrangThai) {
        await updateVehicleById(data.PhuongTienID, { ...vehicle, TrangThai: newVehicleStatus });
      }
    }
  }

  return result;
};

export const deleteTripService = async (id: number) => {
  return await deleteTripById(id);
};

export const searchTripService = async (keyword: string) => {
  return await searchTripByKeyword(keyword);
};