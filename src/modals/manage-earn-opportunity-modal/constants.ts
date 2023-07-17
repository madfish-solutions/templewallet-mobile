import { TokenMetadataInterface, TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';

export const EXPECTED_STAKING_GAS_EXPENSE = 0.4;

export const WTEZ_TOKEN: TokenMetadataInterface = {
  id: 0,
  address: 'KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b',
  name: 'Wrapped Tezos FA2 token',
  symbol: 'wTEZ',
  decimals: 6,
  thumbnailUri: 'ipfs://QmUWhCYXtC8r8aXgjrwsLrZmopiGMHdLWoQzEueAktJbHB',
  standard: TokenStandardsEnum.Fa2
};

export const STABLESWAP_REFERRAL = 'tz1Sw2mFAUzbkm7dkGCDrbeBsJTTtV7JD8Ey';

export const PERCENTAGE_OPTIONS = [25, 50, 75, 100];
