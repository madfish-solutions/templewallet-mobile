export const emptyObject = {};

const xtzToken = {
  id: 'tez',
  type: 0,
  name: 'Tezos',
  shortName: 'tez',
  decimals: 6,
  symbol: 'tez',
  targetSymbol: 'tez',
  unit: 'tez',
  impliedPrice: 1,
  tokenId: 0,
  decimalPlaces: 2,
  inputDecimalPlaces: 4,
  _3RouteId: 0
};

export const contracts = {
  mainnet: [
    {
      id: 'uUSD',
      symbol: 'uUSD',
      metadata: {
        targetSymbol: 'USD',
        impliedPrice: 1.25,
        new: false,
        doubleRewards: ''
      },
      collateralOptions: [
        {
          token: xtzToken,
          targetOracle: {
            address: 'KT1F6Amndd62P8yySM5NkyF4b1Kz27Ft4QeT',
            decimals: 6,
            entrypoint: 'get_price',
            isView: true
          },
          ORACLE_SYMBOL: 'XTZ',
          ENGINE_ADDRESS: 'KT1TcCSR24TmDvwTfHkyWbwMB111gtNYxEcA',
          ENGINE_TYPE: 'tracker-v3-0',
          OPTIONS_LISTING_ADDRESS: 'KT19esJWnECAyezS8w9B3SBBCJMeyFgkBE6L',
          SUPPORTS_BAILOUT: false,
          SUPPORTS_CONVERSION: true,
          HAS_OBSERVED_PRICE: true,
          collateralTarget: 2,
          collateralWarning: 1.7,
          collateralEmergency: 1.6,
          isLatest: true,
          infoBadge: '0%'
        }
      ],
      token: xtzToken,
      governanceToken: xtzToken,
      REWARD_POOL_ADDRESS: 'KT1Lz5S39TMHEA7izhQn8Z1mQoddm6v1jTwH',
      SAVINGS_POOL_ADDRESS: 'KT1M8asPmVQhFG6yujzttGonznkghocEkbFk',
      SAVINGS_V2_POOL_ADDRESS: 'KT1TMfRfmJ5mkJEXZGRCsqLHn2rgnV1SdUzb',
      SAVINGS_V3_POOL_ADDRESS: 'KT18bG4ctcB6rh7gPEPjNsWF8XkQXL2Y1pJe',
      SAVINGS_V2_VESTING_ADDRESS: 'KT1A1VNTvyqJYZN2FypF2kiTBPdoRvG9sCA7',
      GOVERNANCE_DEX: 'KT1PL1YciLdwMbydt21Ax85iZXXyGSrKT2BE'
    },
    {
      id: 'uBTC',
      symbol: 'uBTC',
      metadata: {
        targetSymbol: 'BTC',
        impliedPrice: 1.25,
        new: false,
        doubleRewards: ''
      },

      collateralOptions: [
        {
          token: xtzToken,
          targetOracle: {
            address: 'KT1QDWxfzptWPooyqmf1pjsjGkGcfu8dM32z',
            decimals: 6,
            entrypoint: 'get_price',
            isView: true
          },
          ORACLE_SYMBOL: 'BTC',
          ENGINE_ADDRESS: 'KT1CP1C8afHqdNfBsSE3ggQhzM2iMHd4cRyt',
          ENGINE_TYPE: '',
          OPTIONS_LISTING_ADDRESS: 'KT1H4h1VunWkVE9Cuq1QDVy9xRNLBSbqXsr9',
          SUPPORTS_BAILOUT: false,
          SUPPORTS_CONVERSION: true,
          HAS_OBSERVED_PRICE: false,
          collateralTarget: 2,
          collateralWarning: 1.7,
          collateralEmergency: 1.6,
          isLatest: true,
          migrationPeriodEndTimestamp: 1665489600000
        }
      ]
    }
  ],
  ithacanet: [
    {
      id: 'uUSD',
      symbol: 'uUSD',
      metadata: {
        targetSymbol: 'USD',
        impliedPrice: 1.25,
        new: false,
        doubleRewards: ''
      },
      collateralOptions: [
        {
          token: xtzToken,
          targetOracle: {
            address: 'KT1Ky6b52o2PhrYVm2e6HDUhLUE6rqCcvov8',
            decimals: 6,
            entrypoint: 'get_price',
            isView: true
          },
          ORACLE_SYMBOL: 'XTZ',
          ENGINE_ADDRESS: 'KT1T7Rx3uzj5wwvFVrCnHxo64RvFtS8awJK7',
          ENGINE_TYPE: '',
          OPTIONS_LISTING_ADDRESS: 'KT1JsCFDiQpFPRwgRkKRPfyxyEE4M7b1tTyq',
          SUPPORTS_BAILOUT: true,
          SUPPORTS_CONVERSION: true,
          HAS_OBSERVED_PRICE: true,
          collateralTarget: 3,
          collateralWarning: 2.5,
          collateralEmergency: 2,
          isLatest: true
        }
      ]
    }
  ]
};

jest.mock('youves-sdk/src/networks', () => ({ contracts }));
jest.mock('youves-sdk/src/networks.mainnet', () => emptyObject);
jest.mock('youves-sdk/src/networks.mainnet', () => emptyObject);
jest.mock('youves-sdk/src/public', () => emptyObject);
jest.mock('youves-sdk/src/staking/unified-staking', () => emptyObject);
jest.mock('youves-sdk/src/staking/unified-staking', () => emptyObject);
jest.mock('youves-sdk/src/networks.base', () => emptyObject);
