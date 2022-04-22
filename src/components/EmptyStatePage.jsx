import { useState } from "react";
import { Layout, EmptyState } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import emptystate from "../assets/empty-state.svg";

export function EmptyStatePage({ selectProducts }) {

  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);

  const handleSelection = (resources) => {
    setResourcePickerOpen(false);
    selectProducts(resources.selection.map((product) => product.id));
  };

  return (
      <Layout>
          <ResourcePicker // Resource picker component
            resourceType="Product"
            showVariants={false}
            open={resourcePickerOpen}
            onSelection={(resources) => handleSelection(resources)}
            onCancel={() => setResourcePickerOpen(false)}
          />
        <EmptyState
          heading="Start by selecting the products"
          action={{
            content: "Select products",
            onAction: () => setResourcePickerOpen(true),
          }}
          image={emptystate}
          imageContained
        >
          <p>Choose from the catalog the products you want to propose as free samples or free products.</p>
        </EmptyState>
      </Layout>
  );
}
