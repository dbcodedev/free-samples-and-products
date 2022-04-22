import { gql } from "@apollo/client";

// GraphQL query to retrieve products by IDs.
export const GetProductById = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
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