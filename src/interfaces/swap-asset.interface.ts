import { Trade } from 'swap-router-sdk';

import { AssetAmountInterface } from '../components/asset-amount-input/asset-amount-input';

export interface SwapFormValues {
  inputAssets: AssetAmountInterface;
  outputAssets: AssetAmountInterface;
  bestTrade: Trade | [];
  bestTradeWithSlippageTolerance: Trade | [];
}
