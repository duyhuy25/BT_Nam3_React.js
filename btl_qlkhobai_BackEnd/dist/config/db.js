"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolPromise = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config = {
    user: "sa",
    password: "123",
    server: "DESKTOP-FTDRE2U",
    database: "DoAn2",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
exports.poolPromise = new mssql_1.default.ConnectionPool(config)
    .connect()
    .then(pool => {
    console.log("Connected to SQL Server");
    return pool;
})
    .catch(err => {
    console.log("Database connection failed:", err);
    throw err;
});
