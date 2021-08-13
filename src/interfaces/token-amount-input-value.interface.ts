import { BigNumber } from 'bignumber.js';

import { TokenInterface } from '../token/interfaces/token.interface';

export interface TokenAmountInputValue {
  amount?: BigNumber;
  usdAmount?: BigNumber;
  token: TokenInterface;
}
