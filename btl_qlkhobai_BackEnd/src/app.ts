import express, { Application } from "express";
import cors from "cors";
import containerHistoryRoutes from "./routes/containerHistoryRoutes";
import { pool } from "./config/db";

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());

// test database connection
pool.then(() => {
  console.log("Database connected");
});

// routes
app.use("/api", containerHistoryRoutes);

// server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});