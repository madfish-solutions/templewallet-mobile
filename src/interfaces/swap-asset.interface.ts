import { AssetAmountInterface } from '../components/asset-amount-input/asset-amount-input';
import { TokenInterface } from '../token/interfaces/token.interface';

import { AssetInterface } from './asset.interface';

export interface SwapFormValues<TAsset extends AssetInterface = TokenInterface> {
  inputAssets: AssetAmountInterface<TAsset>;
  outputAssets: AssetAmountInterface<TAsset>;
}
