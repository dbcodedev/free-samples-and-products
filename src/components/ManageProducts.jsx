import { Page, Toast, Frame } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { EmptyStatePage } from "./EmptyStatePage";
import { ProductsList } from "./ProductsList";

export function ManageProducts() {

  const [productsSelection, setProductsSelection] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const localStorageSelection = window.localStorage.getItem("selectedProducts");
    if (localStorageSelection) {
      setProductsSelection(JSON.parse(localStorageSelection));
    }
  }, [])

  const selectProducts = (products) => {
    const newSelection = productsSelection.concat(products);
    setProductsSelection(newSelection);
    window.localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
  }

  const updateProductsSelection = (products) => {
    const newSelection = productsSelection.filter(p => {
      return !products.includes(p);
    })
    setProductsSelection(newSelection);
    window.localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
  }

  const saveProductsSelection = async () => {
      setShowToast(show => !show);
  };

  return (
    <>
      {productsSelection.length > 0 ? 
        <Page
          title="Manage products"
          primaryAction={{
              content: 'Save',
              onAction: () => saveProductsSelection()
          }}>
            <Frame>
              {showToast && <Toast content="Products selection saved" onDismiss={() => setShowToast(show => !show)}/>}
              <ProductsList productIds={productsSelection} selectProducts={selectProducts} updateSelection={updateProductsSelection} />
            </Frame>
        </Page> 
        :
        <Page>
          <EmptyStatePage selectProducts={selectProducts} />
        </Page>
      }
    </>
  );
}
