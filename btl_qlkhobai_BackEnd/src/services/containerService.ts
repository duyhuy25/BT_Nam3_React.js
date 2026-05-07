import {
  getAllContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  searchContainer,
  getContainerById,          
} from "../repositories/containerRepository";
import { updateWarehouseById, getAllWarehouse } from "../repositories/warehousesRepository";
import { getAllTrip, updateTripById } from "../repositories/tripsRepositories";
import { getVehicleById, updateVehicleById } from "../repositories/vehicleRepositories";

export const fetchContainer = async () => {
  return await getAllContainer();
};

import { createHistory } from "../repositories/containerHistoryRepository";

export const createContainerService = async (data: any) => {
  const result = await createContainer(data);
  if (result.recordset && result.recordset.length > 0) {
    const newContainerID = result.recordset[0].ContainerID;
    
    await createHistory({
      ContainerID: newContainerID,
      ThoiGian: new Date(),
      HoatDong: 'Tạo',
      ViTri: 'Kho khởi tạo'
    });
  }
  return result;
};

export const updateContainerService = async (id: number, data: any) => {
  const oldContainer = await getContainerById(id);
  
  // Status activity mapping for history
  const statusToActivity: Record<string, string> = {
    'Rỗng': 'Tạo',
    'Đang đóng hàng': 'Đóng hàng',
    'Đã đóng hàng': 'Đóng hàng',
    'Trong kho': 'Nhập kho',
    'Đã phân công': 'Phân công',
    'Đang vận chuyển': 'Vận chuyển',
    'Đã đến nơi': 'Đến nơi',
    'Đã giao': 'Hoàn thành'
  };

  const activity = statusToActivity[data.TrangThai] || 'Cập nhật';

  await createHistory({
    ContainerID: id,
    ThoiGian: new Date(),
    HoatDong: activity,
    ViTri: 'Hệ thống'
  });

  // Business Logic Side Effects
  
  // 1. Warehouse count management
  if (oldContainer && oldContainer.TrangThai !== 'Trong kho' && data.TrangThai === 'Trong kho' && data.KhoID) {
    const warehouses = await getAllWarehouse();
    const targetWarehouse = warehouses.find((w: any) => w.KhoID === data.KhoID);
    if (targetWarehouse) {
      await updateWarehouseById(data.KhoID, { ...targetWarehouse, SoLuongContainer: (targetWarehouse.SoLuongContainer || 0) + 1 });
    }
  } else if (oldContainer && oldContainer.TrangThai === 'Trong kho' && data.TrangThai !== 'Trong kho' && oldContainer.KhoID) {
    const warehouses = await getAllWarehouse();
    const targetWarehouse = warehouses.find((w: any) => w.KhoID === oldContainer.KhoID);
    if (targetWarehouse) {
      await updateWarehouseById(oldContainer.KhoID, { ...targetWarehouse, SoLuongContainer: Math.max(0, (targetWarehouse.SoLuongContainer || 0) - 1) });
    }
  }

  // 2. Trip status management
  if (data.TrangThai === 'Đã phân công' && data.PhuongTienID) {
    const trips = await getAllTrip();
    // Find a trip that is in 'Chuẩn bị' status and matches the vehicle
    const targetTrip = trips.find((t: any) => t.PhuongTienID === data.PhuongTienID && t.TrangThai === 'Chuẩn bị');
    if (targetTrip) {
      await updateTripById(targetTrip.ChuyenDiID, { ...targetTrip, TrangThai: 'Đã phân công' });
    }
  } else if (data.TrangThai === 'Đang vận chuyển' && data.PhuongTienID) {
    const trips = await getAllTrip();
    const targetTrip = trips.find((t: any) => t.PhuongTienID === data.PhuongTienID && t.TrangThai === 'Đã phân công');
    if (targetTrip) {
      await updateTripById(targetTrip.ChuyenDiID, { ...targetTrip, TrangThai: 'Đang chạy' });
    }
    
    // Also update Vehicle status
    const vehicle = await getVehicleById(data.PhuongTienID);
    if (vehicle && vehicle.TrangThai !== 'Đang chạy') {
      await updateVehicleById(data.PhuongTienID, { ...vehicle, TrangThai: 'Đang chạy' });
    }
  } else if (data.TrangThai === 'Đã giao' && data.PhuongTienID) {
    const trips = await getAllTrip();
    // Find the active trip for this vehicle
    const targetTrip = trips.find((t: any) => t.PhuongTienID === data.PhuongTienID && t.TrangThai === 'Đang chạy');
    if (targetTrip) {
      await updateTripById(targetTrip.ChuyenDiID, { ...targetTrip, TrangThai: 'Hoàn thành' });
    }

    // Reset Vehicle to 'Sẵn sàng'
    const vehicle = await getVehicleById(data.PhuongTienID);
    if (vehicle) {
      await updateVehicleById(data.PhuongTienID, { ...vehicle, TrangThai: 'Sẵn sàng' });
    }
  }

  return await updateContainer(id, data);
};

export const deleteContainerService = async (id: number) => {
  const container = await getContainerById(id);
  if (container && container.TrangThai === 'Trong kho' && container.KhoID) {
    const warehouses = await getAllWarehouse();
    const targetWarehouse = warehouses.find((w: any) => w.KhoID === container.KhoID);
    if (targetWarehouse) {
      await updateWarehouseById(container.KhoID, { ...targetWarehouse, SoLuongContainer: Math.max(0, (targetWarehouse.SoLuongContainer || 0) - 1) });
    }
  }
  return await deleteContainer(id);
};

export const searchContainersService = async (searchTerm: string = "") => {
  return await searchContainer(searchTerm);
};