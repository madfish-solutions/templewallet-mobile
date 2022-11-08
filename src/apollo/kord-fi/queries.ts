import { gql } from '@apollo/client';

export const getTzBtcApyQuery = gql`
  query GetTzBtcApy {
    contractInfo {
      tzbtcDepositRate
    }
  }
`;
