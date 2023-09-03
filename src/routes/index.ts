import { Router } from "express";
import userRoutes from "./user.routes";

export default ([] as Router[]).concat(
    userRoutes,
);
