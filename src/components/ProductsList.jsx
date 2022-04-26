import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ResourceList, ResourceItem, TextStyle, Stack, Thumbnail, Card, Banner } from "@shopify/polaris";
import { Loading, ResourcePicker } from "@shopify/app-bridge-react";
import { GetProductsById } from "../graphql/queries";

export function ProductsList({productIds, selectProducts, updateSelection}) {

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
  
  const { loading, error, data } = useQuery(GetProductsById, {
    variables: { ids: productIds },
  });

  function removeProduct() {
    updateSelection(selectedProducts);
    setSelectedProducts([]);
  }

  const handleSelection = (resources) => {
    setResourcePickerOpen(false);
    selectProducts(resources.selection.map((product) => product.id));
  };

  const bulkActions = [
    {
      content: "Remove products from selection",
      onAction: () => removeProduct(),
    },
  ];

  if (loading) return <Loading />;

  if (error) {
    console.warn(error);
    return (
      <Banner status="critical">There was an issue loading products.</Banner>
    );
  }

  return (
    <Card>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={resourcePickerOpen}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setResourcePickerOpen(false)}
      />
      <Card.Header 
        title="Selected products" 
        actions={[
          {
            content: 'Add product',
            onAction: () => setResourcePickerOpen(true)
          },
        ]}
      />
      <Card.Section>
        <ResourceList
          resourceName={{ singular: "Product", plural: "Products" }}
          items={data.nodes}
          selectedItems={selectedProducts}
          onSelectionChange={setSelectedProducts}
          promotedBulkActions={bulkActions}
          renderItem={(item) => {
            const media = (
              <Thumbnail
                source={
                  item.images.edges[0] ? item.images.edges[0].node.originalSrc : ""
                }
                alt={item.images.edges[0] ? item.images.edges[0].node.altText : ""}
              />
            );

            return (
              <ResourceItem
                id={item.id}
                media={media}
                accessibilityLabel={`View details for ${item.title}`}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">{item.title}</TextStyle>
                    </h3>
                    <p>{item.totalInventory} in stock</p>
                  </Stack.Item>
                </Stack>
              </ResourceItem>
            );
          }}
        />
        </Card.Section>
    </Card>
  );
}
