import { Frame, Page } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { EmptyStatePage } from "./EmptyStatePage";
import { ProductsList } from "./ProductsList";

export function ManageProducts() {

  const [productsSelection, setProductsSelection] = useState([]);

  useEffect(() => {
    const localStorageSelection = window.localStorage.getItem("selectedProducts");
    if (localStorageSelection) {
      setProductsSelection(JSON.parse(localStorageSelection));
    }
  }, [])

  function selectProducts(products) {
    const newSelection = productsSelection.concat(products);
    setProductsSelection(newSelection);
    window.localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
  }

  function updateProductsSelection(products) {
    const newSelection = productsSelection.filter(p => {
      return !products.includes(p);
    })
    setProductsSelection(newSelection);
    window.localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
  }

  return (
    <Page>
      <Frame>
        {productsSelection.length > 0 ? (
              <ProductsList productIds={productsSelection} selectProducts={selectProducts} updateSelection={updateProductsSelection} />
            ) : (
              <EmptyStatePage selectProducts={selectProducts} />
        )}
      </Frame>
    </Page>
  );
}
