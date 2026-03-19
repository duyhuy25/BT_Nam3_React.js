import { getAllCustomer } from "../repositories/customerRepositories";

export const fetchCustomer = async () => {
  return await getAllCustomer();
};