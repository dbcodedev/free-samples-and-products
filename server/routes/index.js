import express from "express";
import SettingsModel from "../../utils/models/SettingsModel.js";
import { Shopify } from "@shopify/shopify-api";

const routes = express.Router()

routes.get("/settings", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const shop = session.shop;

    /*if (session === undefined) {
        res.redirect(`/auth?shop=${shop}&host=${host}`);
        return;
    }*/

    const settings = await SettingsModel.findOne({ id: shop });
    if (settings === null) {
        await SettingsModel.create({
            id: shop,
        });
    }
    res.status(200).send(settings);
});

routes.post("/settings", async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    const shop = session.shop;

    if (shop) {
        await SettingsModel.findOneAndUpdate({ shop }, req.body);
    }

    res.status(200);
});

export default routes;