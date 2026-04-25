"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = void 0;
const usersServices_1 = require("../services/usersServices");
const getUser = async (req, res) => {
    try {
        const data = await (0, usersServices_1.fetchAllUsers)();
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.getUser = getUser;
const addUser = async (req, res) => {
    try {
        await (0, usersServices_1.addUserService)(req.body);
        res.status(201).json({ message: "Thêm user thành công" });
    }
    catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.addUser = addUser;
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await (0, usersServices_1.updateUserService)(id, req.body);
        res.json({ message: "Cập nhật thành công" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }
        await (0, usersServices_1.deleteUserService)(id);
        res.json({ message: "Xóa thành công" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.deleteUser = deleteUser;
const searchUser = async (req, res) => {
    try {
        const search = req.query.search || "";
        const data = await (0, usersServices_1.searchUsersService)(search);
        res.json(data);
    }
    catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
exports.searchUser = searchUser;
