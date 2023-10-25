import { ActivitySubtype } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import { isEmpty } from 'lodash-es';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';

import { isDefined } from './is-defined';

export const isSingleTokenOperation = (amounts: Array<ActivityAmount>) => amounts.length === 1;

const ZERO = new BigNumber(0);

export const separateAmountsBySign = (nonZeroAmounts: Array<ActivityAmount>) => {
  const positiveAmounts: Array<ActivityAmount> = [];
  const negativeAmounts: Array<ActivityAmount> = [];

  for (const amount of nonZeroAmounts) {
    if (amount.isPositive) {
      positiveAmounts.push(amount);
    } else {
      negativeAmounts.push(amount);
    }
  }

  return { positiveAmounts, negativeAmounts };
};

export const calculateDollarValue = (amounts: Array<ActivityAmount>) => {
  const { positiveAmounts, negativeAmounts } = separateAmountsBySign(amounts);

  const source = isEmpty(positiveAmounts) ? negativeAmounts : positiveAmounts;

  return source.reduce((accum, curr) => {
    if (isDefined(curr.fiatAmount)) {
      return accum.plus(curr.fiatAmount);
    }

    return accum;
  }, ZERO);
};

export const getQuipuswapSubtitle = (subtype: ActivitySubtype) => {
  switch (subtype) {
    case ActivitySubtype.QuipuswapCoinflipBet:
    case ActivitySubtype.QuipuswapCoinflipWin:
      return 'Coin flip';
    case ActivitySubtype.QuipuswapAddLiqiudityV1:
      return 'Invest in V1';
    case ActivitySubtype.QuipuswapRemoveLiquidityV1:
      return 'Divest from V1';
    case ActivitySubtype.QuipuswapAddLiqiudityV2:
      return 'Invest in V2';
    case ActivitySubtype.QuipuswapRemoveLiquidityV2:
      return 'Divest from V2';
    case ActivitySubtype.QuipuswapAddLiqiudityV3:
      return 'Invest in V3';
    case ActivitySubtype.QuipuswapRemoveLiquidityV3:
      return 'Divest from V3';
    case ActivitySubtype.QuipuswapAddLiquidityStableswap:
      return 'Invest in stableswap';
    case ActivitySubtype.QuipuswapRemoveLiquidityStableswap:
      return 'Divest from stableswap';
    case ActivitySubtype.QuipuswapInvestInDividends:
      return 'Invest in dividends';
    case ActivitySubtype.QuipuswapDivestFromDividends:
      return 'Divest from dividends';
    case ActivitySubtype.QuipuswapInvestInFarm:
      return 'Stake to farm';
    case ActivitySubtype.QuipuswapDivestFromFarm:
      return 'Unstake from farm';
    case ActivitySubtype.QuipuswapHarvestFromFarm:
      return 'Claim Rewards';
    case ActivitySubtype.QuipuswapHarvestFromDividends:
      return 'Harvest from dividends';
    case ActivitySubtype.QuipuswapSend:
      return 'Swap and Send';
    case ActivitySubtype.QuipuswapReceive:
      return 'Receive from swap';

    default:
      return '-';
  }
};
