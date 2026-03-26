import {
  getAllCustomer,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
  searchCustomerByKeyword
} from "../repositories/customerRepositories";

export const fetchCustomer = async () => {
  return await getAllCustomer();
};

export const addCustomerService = async (data: any) => {
  return await createCustomer(data);
};

export const updateCustomerService = async (id: number, data: any) => {
  return await updateCustomerById(id, data);
};

export const deleteCustomerService = async (id: number) => {
  return await deleteCustomerById(id);
};

export const searchCustomerService = async (keyword: string) => {
  return await searchCustomerByKeyword(keyword);
};