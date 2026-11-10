import { BigNumber } from 'bignumber.js';

import { SendAsset } from 'src/types/send-asset';
import { getDollarValue } from 'src/utils/balance.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

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

  const balanceDifference = mutezToTz(new BigNumber(second.balance), second.decimals).minus(
    mutezToTz(new BigNumber(first.balance), first.decimals)
  );

  return balanceDifference.isZero() ? first.symbol.localeCompare(second.symbol) : balanceDifference.toNumber();
};

export const sortSendAssets = (assets: SendAsset[]): SendAsset[] => [...assets].sort(compareSendAssets);
