import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares";
import { customResponse } from "./middlewares";
import { connectDatabase } from "./utils";
import routes from "./routes";

require("dotenv").config();

const app: Application = express();

dotenv.config({ path: path.join(__dirname, "/.env") });
const PORT: number = parseInt(process.env.PORT, 10) || 8080;

//security
const corsOptions = {
    origin: 'http://localhost:8080'
}
app.use(cors(corsOptions));
app.use(helmet());

//DB connection
mongoose.set("strictQuery", false);
connectDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(customResponse);
app.use("/api/", routes);
app.use(errorHandler);

app.listen(PORT, () => console.log("⚡️[server]: is running on port: " + PORT));
