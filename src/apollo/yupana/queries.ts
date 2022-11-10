import { gql } from '@apollo/client';

export const getKUSDApyQuery = gql`
  query GetKUSDApy {
    asset(where: { ytoken: { _eq: 2 } }) {
      rates {
        supply_apy
      }
    }
  }
`;
