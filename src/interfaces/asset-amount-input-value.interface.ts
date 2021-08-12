import { BigNumber } from 'bignumber.js';

import { TokenInterface } from '../token/interfaces/token.interface';

export interface AssetAmountInputValue {
  amount?: BigNumber;
  token: TokenInterface;
}
