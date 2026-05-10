import { Request, Response } from "express";
import {
  fetchAllUsers,
  addUserService,
  updateUserService,
  deleteUserService,
  searchUsersService,
  loginService,
} from "../services/usersServices";

export const getUser = async (req: Request, res: Response) => {
  try {
    const data = await fetchAllUsers();
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    await addUserService(req.body);
    res.status(201).json({ message: "Thêm user thành công" });
  } catch (error: any) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    await updateUserService(id, req.body);
    res.json({ message: "Cập nhật thành công" });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    await deleteUserService(id);
    res.json({ message: "Xóa thành công" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || "";
    const data = await searchUsersService(search);
    res.json(data);
  } catch (error: any) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await loginService(username, password);
    res.json(user);
  } catch (error: any) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: error.message });
  }
};