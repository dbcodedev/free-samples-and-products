import express from "express";

const webhookRoutes = express.Router();

import { appUninstallRoute } from "./app_uninstalled.js";
import { gdprRoutes } from "./gdpr.js";

//Combine all routes here.
webhookRoutes.use("/", gdprRoutes);
webhookRoutes.use("/", appUninstallRoute);

export default webhookRoutes;