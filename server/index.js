// @ts-check
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";

import applyAuthMiddleware from "./middleware/auth.js";
import csp from "./middleware/csp.js";
import verifyRequest from "./middleware/verifyRequest.js";
import isActiveShop from "./middleware/isActiveShop.js";
import sessionStorage from "../utils/sessionStorage.js";
import webhookRoutes from "./webhooks/routes.js";

import routes from "./routes/index.js";

import { appUninstallHandler } from "./webhooks/app_uninstalled.js";
import { customerDataRequest, customerRedact, shopRedact } from "./webhooks/gdpr.js";

import mongoose from "mongoose";

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isDev = process.env.NODE_ENV === "dev";

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on("error", error => console.log(error));
//db.once("open", () => console.log("Connected to mongoose"));

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  //SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
  SESSION_STORAGE: sessionStorage,
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
/*const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop]
  },
});*/

Shopify.Webhooks.Registry.addHandlers({
  APP_UNINSTALLED: {
    path: "/webhooks/app_uninstalled",
    webhookHandler: appUninstallHandler,
  },
  CUSTOMERS_DATA_REQUEST: {
    path: "/webhooks/gdpr/customers_data_request",
    webhookHandler: customerDataRequest,
  },
  CUSTOMERS_REDACT: {
    path: "/webhooks/gdpr/customers_redact",
    webhookHandler: customerRedact,
  },
  SHOP_REDACT: {
    path: "/webhooks/gdpr/shop_redact",
    webhookHandler: shopRedact,
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  //app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.use("/webhooks", webhookRoutes);

  app.use("/apps", verifyRequest(app), routes);

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json());
  app.use(csp);
  app.use(isActiveShop);

  /*app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });*/

  /*app.use("/*", (req, res, next) => {
    const shop = req.query.shop;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?shop=${shop}`);
    } else {
      next();
    }
  });*/

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isDev ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isDev) {
  createServer().then(({ app }) => app.listen(PORT));
}
