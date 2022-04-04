import { useState, useCallback } from "react";
import { ResourceList, TextStyle, Stack, Thumbnail, TextField } from "@shopify/polaris";

export function ProductsList({ data }) {

  const [selectedItems, setSelectedItems] = useState([]);
  const [value, setValue] = useState(1);

  const bulkActions = [
    {
      content: "Remove products",
      onAction: () => console.log("Product removed"),
    },
  ];

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  return (
    <ResourceList // Defines your resource list component
      showHeader
      resourceName={{ singular: "Product", plural: "Products" }}
      items={data.nodes}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      bulkActions={bulkActions}
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
          <ResourceList.Item
            id={item.id}
            media={media}
            accessibilityLabel={`View details for ${item.title}`}
          >
            <Stack>
              <Stack.Item fill>
                <h3>
                  <TextStyle variation="strong">{item.title}</TextStyle>
                </h3>
              </Stack.Item>
              <Stack.Item>
                <TextField
                    label="Max quantity per user"
                    type="number"
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                />
              </Stack.Item>
            </Stack>
          </ResourceList.Item>
        );
      }}
    />
  );
}
