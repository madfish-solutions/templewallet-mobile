import { createContext, useContext } from 'react';

import { AssetInterface } from 'src/interfaces/asset.interface';

interface SwapAssetsContextValue {
  inputAssets: AssetInterface[];
  onSelectInput: (asset: AssetInterface) => void;
}

export const SwapAssetsContext = createContext<SwapAssetsContextValue>({
  inputAssets: [],
  onSelectInput: () => undefined
});

export const useSwapAssets = () => useContext(SwapAssetsContext);
