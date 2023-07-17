import { BigNumber } from 'bignumber.js';

import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { Route3Token } from 'src/interfaces/route3.interface';

export const DEFAULT_LIQUIDITY_BAKING_SUBSIDY = new BigNumber(1250000);
export const DEFAULT_MINIMAL_BLOCK_DELAY = new BigNumber(15);
export const liquidityBakingStakingId = 'lb';

export const SIRS_TOKEN_METADATA = {
  decimals: 0,
  symbol: 'SIRS',
  name: 'Sirius',
  thumbnailUri: 'ipfs://QmNXQPkRACxaR17cht5ZWaaKiQy46qfCwNVT5FGZy6qnyp'
};

export const THREE_ROUTE_XTZ_TOKEN: Route3Token = {
  id: 0,
  symbol: 'XTZ',
  standard: Route3TokenStandardEnum.xtz,
  contract: null,
  tokenId: null,
  decimals: 6
};

export const THREE_ROUTE_TZBTC_TOKEN: Route3Token = {
  id: 2,
  symbol: 'TZBTC',
  standard: Route3TokenStandardEnum.fa12,
  contract: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
  tokenId: null,
  decimals: 8
};

export const THREE_ROUTE_SIRS_TOKEN: Route3Token = {
  id: 127,
  symbol: 'SIRS',
  standard: Route3TokenStandardEnum.fa12,
  contract: 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo',
  tokenId: null,
  decimals: 0
};
