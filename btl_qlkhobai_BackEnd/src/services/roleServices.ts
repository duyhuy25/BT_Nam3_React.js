import { getAllRoles } from "../repositories/roleRepositories";

export const fetchAllRoles = async () => {
  return await getAllRoles();
};
