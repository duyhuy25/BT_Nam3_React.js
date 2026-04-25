"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersService = exports.deleteUserService = exports.updateUserService = exports.addUserService = exports.fetchAllUsers = void 0;
const usersRepositories_1 = require("../repositories/usersRepositories");
const fetchAllUsers = async () => {
    return await (0, usersRepositories_1.getAllUser)();
};
exports.fetchAllUsers = fetchAllUsers;
const addUserService = async (data) => {
    if (!data.Username || !data.PasswordHash || !data.RoleID) {
        throw new Error("Thiếu thông tin bắt buộc: Username, PasswordHash, RoleID");
    }
    return await (0, usersRepositories_1.createUser)(data);
};
exports.addUserService = addUserService;
const updateUserService = async (id, data) => {
    if (!data.RoleID) {
        data.RoleID = 1;
    }
    return await (0, usersRepositories_1.updateUserById)(id, data);
};
exports.updateUserService = updateUserService;
const deleteUserService = async (id) => {
    return await (0, usersRepositories_1.deleteUserById)(id);
};
exports.deleteUserService = deleteUserService;
const searchUsersService = async (keyword) => {
    return await (0, usersRepositories_1.searchUserByKeyword)(keyword);
};
exports.searchUsersService = searchUsersService;
