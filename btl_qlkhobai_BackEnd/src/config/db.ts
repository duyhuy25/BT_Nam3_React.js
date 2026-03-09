import sql from "mssql";

const config = {
  user: "sa",
  password: "123",
  server: "DESKTOP-FTDRE2U",
  database: "ContainerDB",
  options: {
    instanceName: "SQLEXPRESS06",
    encrypt: false,
    trustServerCertificate: true
  }
};

export const pool = new sql.ConnectionPool(config).connect();