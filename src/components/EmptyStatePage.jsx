import { useState } from "react";
import { Page, Layout, EmptyState } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg';

export function EmptyStatePage({ setSelection }) {

  const [open, setOpen] = useState(false);

  const handleSelection = (resources) => {
    setOpen(false);
    setSelection(resources.selection.map((product) => product.id));
  };

  return (
    <Page>
      <ResourcePicker // Resource picker component
        resourceType="Product"
        showVariants={false}
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        <EmptyState
          heading="Select products to propose for free"
          action={{
            content: "Select products",
            onAction: () => setOpen(true),
          }}
          image={img}
          imageContained
        >
          <p>Select products to change their price temporarily.</p>
        </EmptyState>
      </Layout>
    </Page>
  );
}
