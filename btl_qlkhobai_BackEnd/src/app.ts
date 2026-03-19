import express from "express";
import cors from "cors";
import containerHistoryRoutes from "./routes/containerHistoryRoutes";
import containerRoutes from "./routes/containerRoutes"
import itemtypeRoutes from "./routes/itemtypeRoutes"
import warehouseRoutes from "./routes/warehousesRoutes"
import vehicle from "./routes/vehicleRoutes"
import trip from "./routes/tripsRoutes"
import port from "./routes/portRoutes"
import customer from "./routes/customerRoutes"
import contract from "./routes/contractRoutes"
import cost from "./routes/costRoutes"
import invoice from "./routes/invoiceRoutes"

const app = express();

app.use(cors());      
app.use(express.json());

app.use("/api/history", containerHistoryRoutes);
app.use("/api/container", containerRoutes);
app.use("/api/itemtype", itemtypeRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/vehicle", vehicle);
app.use("/api/trip", trip);
app.use("/api/port", port);
app.use("/api/customer", customer);
app.use("/api/contract", contract);
app.use("/api/cost", cost);
app.use("/api/invoice", invoice);

export default app;