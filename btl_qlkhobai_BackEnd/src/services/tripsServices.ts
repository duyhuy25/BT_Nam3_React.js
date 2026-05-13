import {
  getAllTrip,
  createTrip,
  updateTripById,
  deleteTripById,
  searchTripByKeyword
} from "../repositories/tripsRepositories";
import { getVehicleById, updateVehicleById } from "../repositories/vehicleRepositories";
import { getAllContainer, updateContainer } from "../repositories/containerRepository";

export const fetchTrip = async () => {
  return await getAllTrip();
};

export const addTripService = async (data: any) => {
  return await createTrip(data);
};

export const updateTripService = async (id: number, data: any) => {
  const originalStatus = data.TrangThai;
  let statusToSave = data.TrangThai;

  // Tác vụ phụ: cập nhật trạng thái phương tiện và container theo trạng thái chuyến đi
  if (data.PhuongTienID) {
    const vehicle = await getVehicleById(data.PhuongTienID);

    if (vehicle) {
      let newVehicleStatus = vehicle.TrangThai;

      if (originalStatus === 'Hoàn thành' || originalStatus === 'Hủy') {
        newVehicleStatus = 'Sẵn sàng';

        // Đồng thời cập nhật các container đang thuộc phương tiện này
        const containers = await getAllContainer();

        const containersOnVehicle = containers.filter(
          (c: any) =>
            c.PhuongTienID === data.PhuongTienID &&
            c.TrangThai === 'Đang vận chuyển'
        );

        for (const c of containersOnVehicle) {
          await updateContainer(c.ContainerID, {
            ...c,
            TrangThai: 'Đã giao'
          });
        }

        // Nếu trạng thái là 'Hoàn thành'
        // thì đưa chuyến đi về lại trạng thái 'Chuẩn bị'
        // để bắt đầu chu trình mới
        if (originalStatus === 'Hoàn thành') {
          statusToSave = 'Chuẩn bị';
        }

      } else if (originalStatus === 'Đang chạy') {
        newVehicleStatus = 'Đang chạy';
      }

      // Chỉ cập nhật nếu trạng thái phương tiện thay đổi
      if (newVehicleStatus !== vehicle.TrangThai) {
        await updateVehicleById(data.PhuongTienID, {
          ...vehicle,
          TrangThai: newVehicleStatus
        });
      }
    }
  }

  return await updateTripById(id, {
    ...data,
    TrangThai: statusToSave
  });
};

export const deleteTripService = async (id: number) => {
  return await deleteTripById(id);
};

export const searchTripService = async (keyword: string) => {
  return await searchTripByKeyword(keyword);
};