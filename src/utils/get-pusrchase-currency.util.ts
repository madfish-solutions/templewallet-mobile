import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';

import { objktCurrencies } from 'src/apis/objkt';
import { ListingActive } from 'src/token/interfaces/collectible-interfaces.interface';

import { mutezToTz } from './tezos.util';

const initialCurrencyValue = {
  price: 0,
  contract: null,
  decimals: 0,
  id: null,
  symbol: '',
  priceToDisplay: 0
};

export const getPurchaseCurrency = (listingsActive: ListingActive[]) => {
  if (isNonEmptyArray(listingsActive)) {
    const { price, currency_id } = listingsActive[0];
    const currentCurrency = objktCurrencies[currency_id];
    const priceToDisplay = +mutezToTz(new BigNumber(price), currentCurrency.decimals);

    return { price, priceToDisplay, ...currentCurrency };
  }

  return initialCurrencyValue;
};
