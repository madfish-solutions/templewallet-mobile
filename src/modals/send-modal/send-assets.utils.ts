import { BigNumber } from 'bignumber.js';

import { SendAsset } from 'src/types/send-asset';
import { getDollarValue } from 'src/utils/balance.utils';
import { isDefined } from 'src/utils/is-defined';

const compareSendAssets = (first: SendAsset, second: SendAsset) => {
  const firstFiat = isDefined(first.exchangeRate)
    ? getDollarValue(first.balance, first.decimals, first.exchangeRate).toNumber()
    : 0;
  const secondFiat = isDefined(second.exchangeRate)
    ? getDollarValue(second.balance, second.decimals, second.exchangeRate).toNumber()
    : 0;

  if (firstFiat !== secondFiat) {
    return secondFiat - firstFiat;
  }

  const balanceDifference = new BigNumber(second.balance)
    .shiftedBy(-second.decimals)
    .minus(new BigNumber(first.balance).shiftedBy(-first.decimals));

  return balanceDifference.isZero()
    ? first.symbol.localeCompare(second.symbol)
    : balanceDifference.isPositive()
    ? 1
    : -1;
};

export const sortSendAssets = (assets: SendAsset[]): SendAsset[] => [...assets].sort(compareSendAssets);
