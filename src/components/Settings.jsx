import { ResourcePicker, Toast } from "@shopify/app-bridge-react";
import { Button, Card, Checkbox, FormLayout, Frame, Icon, Layout, Page, PageActions, TextContainer, TextField } from "@shopify/polaris";
import { CircleTickOutlineMinor, CircleCancelMinor } from '@shopify/polaris-icons';
import { useState, useCallback } from "react";
import { ProductsList } from "./ProductsList";
import "../css/custom.css";
import { setDoc, collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useSettings } from "../context/SettingsContext";

export function Settings() {

    const [settings, setSettings] = useSettings();

    const [appActive, setAppActive] = useState(true);

    const [productPickerOpen, setProductPickerOpen] = useState(false);

    const toggleProductPicker = useCallback(() => {
        setProductPickerOpen(!productPickerOpen)
      }, [productPickerOpen]);

    const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

    const toggleCollectionPicker = useCallback(() => {
        setCollectionPickerOpen(!collectionPickerOpen)
      }, [collectionPickerOpen]);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);

    const [showToast, setShowToast] = useState(false);


    const handleProductsSelection = (resources) => {
        toggleProductPicker();
        setSelectedProducts(resources.selection.map((product) => product.id));
    };

    const handleCollectionsSelection = (resources) => {
        toggleCollectionPicker();
        setSelectedCollections(resources.selection.map((collection) => collection.id));
      };

    const handleUpdateSettings = (value, id) => {
        setSettings({
          ...settings,
          [id]:value
        })
    };

    const saveSettings = async () => {
        await setDoc(doc(db, "settings", "test"), settings);
        setShowToast(show => !show);
    };

    return (
        <Page 
            title="Settings"
            primaryAction={{
                content: 'Save',
                onAction: () => saveSettings()
            }}>
            <Frame>
                {showToast && <Toast content="Settings updated" onDismiss={() => setShowToast(show => !show)}/>}

                { productPickerOpen ?
                    <ResourcePicker
                        resourceType="Product"
                        key="productPicker"
                        showVariants={false}
                        open={productPickerOpen}
                        onSelection={(resources) => handleProductsSelection(resources)}
                        onCancel={() => setProductPickerOpen(false)}
                    />
                :
                    <ResourcePicker
                        resourceType="Collection"
                        key="collectionPicker"
                        open={collectionPickerOpen}
                        onSelection={(resources) => handleCollectionsSelection(resources)}
                        onCancel={() => setCollectionPickerOpen(false)}
                    />
                }
                <Layout>
                    <Layout.AnnotatedSection
                        id="appActive"
                        title="Status"
                        description="Enable the Free Samples and Products app on your site."
                    >
                        <Card className="enable-app-card">
                            <Card.Section>
                                {appActive ? 
                                <div className="enable-app-card">
                                    <span><Icon source={CircleTickOutlineMinor} color="success" /></span>
                                    <p>The Free Samples and Products app is <strong>active</strong> on you shop</p>
                                    <span className="enable-app-button">
                                        <Button primary onClick={() => setAppActive(false)}>Disable</Button>
                                    </span>
                                </div> :
                                <div className="enable-app-card">
                                    <span><Icon source={CircleCancelMinor} color="critical" /></span>
                                    <p>The Free Samples and Products app is <strong>not active</strong> on you shop</p>
                                    <span className="enable-app-button">
                                        <Button primary onClick={() => setAppActive(true)}>Enable</Button>
                                    </span>
                                </div>
                                }
                            </Card.Section>
                        </Card>
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection
                        id="maxByUser"
                        title="Number of free products by user"
                        description="Set the maximum number of free products a user can pick, and the maximum number by reference."
                    >
                        <FormLayout>
                            <TextField 
                                id="maxProductsByUser" 
                                label="Maximum number of free products by user" 
                                type="number"
                                value={settings.maxProductsByUser}
                                onChange={(value, id) => handleUpdateSettings(value, id)} 
                            />
                            <TextField 
                                id="maxReferenceByUser" 
                                label="Maximum quantity by reference" 
                                type="number"
                                value={settings.maxReferenceByUser}
                                onChange={(value, id) => handleUpdateSettings(value, id)} 
                            />
                        </FormLayout>
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection
                        id="maxProducts"
                        title="Number of free products to display"
                        description="Set the maximum number of free products to display. If more products are selected, they can be displayed randomly."
                    >
                        <FormLayout>
                            <TextField 
                                id="maxProducts" 
                                label="Maximum number of free products to display" 
                                type="number"
                                value={settings.maxProducts}
                                onChange={(value, id) => handleUpdateSettings(value, id)} 
                            />
                            <Checkbox 
                                id="displayRandomly" 
                                label="Display products randomly" 
                                checked={settings.displayRandomly} 
                                onChange={(value, id) => handleUpdateSettings(value, id)}
                            />
                            <Checkbox 
                                id="hideOutOfStock" 
                                label="Hide products out of stock" 
                                checked={settings.hideOutOfStock} 
                                onChange={(value, id) => handleUpdateSettings(value, id)}
                            />
                        </FormLayout>
                    </Layout.AnnotatedSection>
                    <Layout.AnnotatedSection
                        id="cartConfig"
                        title="Cart content"
                        description="Conditions to display the free products depending on the content of the cart."
                    >
                        <FormLayout>
                            <TextField 
                                id="minCartProducts" 
                                label="Minimum number of products in the cart" 
                                type="number" 
                                value={settings.minCartProducts}
                                onChange={(value, id) => handleUpdateSettings(value, id)}  
                            />
                            <TextField 
                                id="minCartAmount" 
                                label="Minimum amount of the cart" 
                                type="number" 
                                value={settings.minCartAmount}
                                onChange={(value, id) => handleUpdateSettings(value, id)}  
                            />
                            <Card >
                                <Card.Header title="Products added in the cart"></Card.Header>
                                <Card.Section>
                                    <TextContainer>
                                        The free products will be displayed only if some specific products are in the cart.
                                    </TextContainer>
                                </Card.Section>
                                <Card.Section>
                                    {
                                    selectedProducts.length === 0 ?
                                        <Button 
                                            primary 
                                            onClick={() => toggleProductPicker()}>
                                            Select products
                                        </Button>
                                        :
                                        <ProductsList productIds={selectedProducts} selectProducts={handleProductsSelection} />
                                    }
                                </Card.Section>
                            </Card>
                            <Card>
                                <Card.Header title="Products of collections added in the cart"></Card.Header>
                                    <Card.Section>
                                        <TextContainer>
                                            The free products will be displayed only if products of some specific collections are in the cart.
                                        </TextContainer>
                                    </Card.Section>
                                <Card.Section>
                                    {
                                    selectedCollections.length === 0 ?
                                        <Button 
                                            primary 
                                            onClick={() => toggleCollectionPicker()}>
                                            Select collections
                                        </Button>
                                        :
                                        <p>{selectedCollections}</p>
                                    }
                                </Card.Section>
                            </Card>
                        </FormLayout>
                    </Layout.AnnotatedSection>
                </Layout>
                <PageActions
                    primaryAction={{
                        content: 'Save',
                        onAction: () => saveSettings()
                    }}
                />
            </Frame>
        </Page>
    )
}