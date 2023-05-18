import { BigNumber } from 'bignumber.js';

import { isDefined } from './is-defined';

const DEFAULT_TEZOS_DECIMALS = 6;

export const convertUnits = (value: number | string | BigNumber | null, decimals = DEFAULT_TEZOS_DECIMALS) =>
  isDefined(value) ? new BigNumber(value).div(new BigNumber(10).pow(decimals)).decimalPlaces(decimals) : null;
