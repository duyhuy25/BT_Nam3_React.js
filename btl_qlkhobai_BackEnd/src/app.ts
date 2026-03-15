import express from "express";
import cors from "cors";
import containerHistoryRoute from "./routes/containerHistoryRoutes";
import container from "./routes/containerRoutes"

const app = express();

app.use(cors());      
app.use(express.json());

app.use("/api/history", containerHistoryRoute);
app.use("/api/container", container)

export default app;