import { createContext, useContext } from 'react';

import { AssetInterface } from 'src/interfaces/asset.interface';
import { EvmSwapAsset } from 'src/types/evm-swap';

interface SwapAssetsContextValue {
  inputAssets: AssetInterface[];
  evmAssets: EvmSwapAsset[];
  onSelectInput: (asset: AssetInterface) => void;
}

export const SwapAssetsContext = createContext<SwapAssetsContextValue>({
  inputAssets: [],
  evmAssets: [],
  onSelectInput: () => undefined
});

export const useSwapAssets = () => useContext(SwapAssetsContext);
