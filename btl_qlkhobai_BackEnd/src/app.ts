import express from "express";
import cors from "cors";
import containerHistoryRoute from "./routes/containerHistoryRoutes";

const app = express();

app.use(cors());      
app.use(express.json());

app.use("/api/history", containerHistoryRoute);

export default app;