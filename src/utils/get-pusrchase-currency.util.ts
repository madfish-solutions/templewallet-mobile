import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';

import { currencyInfoById } from '../apis/objkt/constants';
import { ListingsActive } from '../token/interfaces/collectible-interfaces.interface';
import { mutezToTz } from './tezos.util';

const initialCurrencyValue = {
  price: 0,
  contract: null,
  decimals: 0,
  id: null,
  symbol: '',
  priceToDisplay: 0
};

export const getPurchaseCurrency = (listingsActive: ListingsActive[]) => {
  if (isNonEmptyArray(listingsActive)) {
    const { price, currencyId } = listingsActive[0];
    const currentCurrency = currencyInfoById[currencyId];
    const priceToDisplay = +mutezToTz(new BigNumber(price), currentCurrency.decimals);

    return { price, priceToDisplay, ...currentCurrency };
  }

  return initialCurrencyValue;
};
