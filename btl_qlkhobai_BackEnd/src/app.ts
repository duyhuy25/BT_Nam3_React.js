import express from "express";
import cors from "cors";
import containerHistoryRoutes from "./routes/containerHistoryRoutes";
import containerRoutes from "./routes/containerRoutes"
import itemtypeRoutes from "./routes/itemtypeRoutes"
import warehouseRoutes from "./routes/warehousesRoutes"
import vehicle from "./routes/vehicleRoutes"

const app = express();

app.use(cors());      
app.use(express.json());

app.use("/api/history", containerHistoryRoutes);
app.use("/api/container", containerRoutes);
app.use("/api/itemtype", itemtypeRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/vehicle", vehicle);

export default app;