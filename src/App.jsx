import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import { AppProvider as PolarisProvider, Frame } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

import { useState } from "react";

import { EmptyStatePage } from "./components/EmptyStatePage";
import { ProductsPage } from "./components/ProductsPage";
import { NavigationMenu } from "./components/NavigationMenu";

export default function App() {
  const localStorageSelection = window.localStorage.getItem("selectedProducts");
  const [productsSelection, setProductsSelection] = useState(localStorageSelection ? JSON.parse(localStorageSelection) : []);

  function handleSelectProducts(products) {
    setProductsSelection(products);
    window.localStorage.setItem("selectedProducts", JSON.stringify(products));
  }

  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider
        config={{
          apiKey: process.env.SHOPIFY_API_KEY,
          host: new URL(location).searchParams.get("host"),
          forceRedirect: true,
        }}
      >
        <MyProvider>
          <Frame
            navigation={<NavigationMenu />}
          >
            {productsSelection.length > 0 ? (
              <ProductsPage productIds={productsSelection} />
            ) : (
              <EmptyStatePage setSelection={handleSelectProducts} />
            )}
          </Frame>
        </MyProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

function MyProvider({ children }) {
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
