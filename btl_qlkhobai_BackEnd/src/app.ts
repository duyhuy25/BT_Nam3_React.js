import express from "express";
import cors from "cors";
import containerHistoryRoutes from "./routes/containerHistoryRoutes";
import containerRoutes from "./routes/containerRoutes"
import itemtypeRoutes from "./routes/itemtypeRoutes"

const app = express();

app.use(cors());      
app.use(express.json());

app.use("/api/history", containerHistoryRoutes);
app.use("/api/container", containerRoutes);
app.use("/api/itemtype", itemtypeRoutes)

export default app;