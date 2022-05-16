import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { Provider as AppBridgeProvider, useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { BrowserRouter as Router } from 'react-router-dom';

import { Link } from "./router/Link";
import AppRoutes from "./router/AppRoutes";

import { SettingsProvider } from "./context/SettingsContext";
import { useState, useEffect } from "react";

import { useGetData } from "./hooks/useBackend";

export default function App() {

  const [settings, setSettings] = useState({});

  useEffect(() => {
    const settings = useGetData("settings");
      
    if (settings.length > 0) {
        setSettings(settings[0]);
    } else {
        const set = {
            maxProductsByUser: "5",
            maxReferenceByUser: "2",
            maxProducts: "0",
            displayRandomly: false,
            hideOutOfStock: true,
            minCartProducts: "0",
            minCartAmount: "0",
        }
        setSettings(set);
    }
}, []);

  return (
    <Router>
      <AppProvider i18n={translations} linkComponent={Link}>
          <AppBridgeProvider
            config={{
              apiKey: process.env.SHOPIFY_API_KEY,
              host: new URL(location).searchParams.get("host"),
              forceRedirect: true,
            }}
          >
            <SettingsProvider value={[settings, setSettings]}>
              <MyApolloProvider>
                <AppRoutes />
              </MyApolloProvider>
            </SettingsProvider>
          </AppBridgeProvider>
      </AppProvider>
    </Router>
  );
}

function MyApolloProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
