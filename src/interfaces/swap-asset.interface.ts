import BigNumber from 'bignumber.js';
import { Trade } from 'swap-router-sdk';

import { TokenInterface } from '../token/interfaces/token.interface';

export interface AssetAmountInterface {
  asset: TokenInterface;
  amount?: BigNumber;
}

export interface SwapFormValues {
  inputAssets: AssetAmountInterface;
  outputAssets: AssetAmountInterface;
  bestTrade: Trade | [];
  bestTradeWithSlippageTolerance: Trade | [];
}
