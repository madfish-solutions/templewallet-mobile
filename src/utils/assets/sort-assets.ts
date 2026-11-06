import { BigNumber } from 'bignumber.js';

import { AssetInterface } from 'src/interfaces/asset.interface';
import { getDollarValue } from 'src/utils/balance.utils';
import { isDefined } from 'src/utils/is-defined';

const compareAssetsByValue = (first: AssetInterface, second: AssetInterface) => {
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

  return balanceDifference.isZero() ? first.symbol.localeCompare(second.symbol) : balanceDifference.toNumber();
};

export const sortAssetsByValue = <TAsset extends AssetInterface>(assets: TAsset[]): TAsset[] =>
  [...assets].sort(compareAssetsByValue);
