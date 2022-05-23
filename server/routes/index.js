import express from "express";
import SettingsModel from "../../utils/models/SettingsModel.js";
import { Shopify } from "@shopify/shopify-api";

const routes = express.Router()

routes.get("/settings", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const shop = session.shop;
    const settings = await SettingsModel.findOne({ id: shop });
    if (settings === null) {
        await SettingsModel.create({
            id: shop,
            content: "test"
        });
    }
    console.log(settings)
    res.status(200);
});

routes.post("/settings", async (req, res) => {

});

export default routes;