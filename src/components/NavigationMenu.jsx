import { useState, useCallback } from "react";
import { Loading, Navigation } from "@shopify/polaris";
import {
  ProductsMajor,
  SettingsMajor,
  ConversationMinor,
} from "@shopify/polaris-icons";

export function NavigationMenu() {
  const [isLoading, setIsLoading] = useState(false);

  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    []
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  return (
    <Navigation location="/">
      {loadingMarkup}
      <Navigation.Section
        separator
        title="Free Samples and Products"
        items={[
          {
            label: "Manage products",
            icon: ProductsMajor,
            onClick: toggleIsLoading,
          },
          {
            label: "Settings",
            icon: SettingsMajor,
            onClick: toggleIsLoading,
          },
        ]}
        action={{
          icon: ConversationMinor,
          accessibilityLabel: "Contact support",
          onClick: toggleIsLoading,
        }}
      />
    </Navigation>
  );
}
