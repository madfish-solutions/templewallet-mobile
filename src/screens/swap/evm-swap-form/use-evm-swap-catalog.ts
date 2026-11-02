import { useMemo } from 'react';

import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useEvmSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { buildEvmSwapCatalog } from 'src/utils/evm/swap.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export const useEvmSwapCatalog = () => {
  const address = useAccountAddressForEvm();
  const { data: tokens } = useEvmSwapTokensSelector();
  const balances = useEvmAccountChainBalancesSelector(address, ETHERLINK_MAINNET_CHAIN_ID);
  const assets = useEvmAccountChainAssetsSelector(address, ETHERLINK_MAINNET_CHAIN_ID);
  const metadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatRate = useFiatToUsdRateSelector();
  const catalog = useMemo(
    () => buildEvmSwapCatalog(tokens, balances, assets, metadata, fiatRate),
    [tokens, balances, assets, metadata, fiatRate]
  );

  return catalog;
};
