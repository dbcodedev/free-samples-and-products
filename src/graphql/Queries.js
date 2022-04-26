import { gql } from "@apollo/client";

// GraphQL query to retrieve products by IDs.
export const GetProductsById = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        totalInventory
        id
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to retrieve collections by IDs.
export const GetCollectionsById = gql`
  query getCollections($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Collection {
        title
        handle
        id
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
      }
    }
  }
`;