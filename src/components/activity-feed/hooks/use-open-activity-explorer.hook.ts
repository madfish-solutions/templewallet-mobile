import { useCallback, useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChains } from 'src/hooks/evm/use-evm-chains.hook';
import { useTezosChain } from 'src/hooks/use-tezos-chains.hook';
import { useIsInAppBrowserEnabledSelector } from 'src/store/settings/settings-selectors';
import { openUrl, useOpenUrlInAppBrowser } from 'src/utils/linking';

import { ActivityChainRef } from '../types';
import { buildActivityExplorerUrl } from '../utils';

export const useOpenActivityExplorer = ({ chain, chainId }: ActivityChainRef, hash: string) => {
  const tezosChain = useTezosChain();
  const evmChains = useEvmChains();
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();
  const openUrlInAppBrowser = useOpenUrlInAppBrowser();

  const url = useMemo(() => {
    const explorer =
      chain === TempleChainKind.Tezos
        ? tezosChain.activeBlockExplorer
        : evmChains.find(evmChain => evmChain.chainId === chainId)?.activeBlockExplorer;

    return explorer == null ? undefined : buildActivityExplorerUrl(explorer.url, hash, chain);
  }, [chain, chainId, hash, tezosChain, evmChains]);

  const handlePress = useCallback(() => {
    if (url == null) {
      return;
    }

    isInAppBrowserEnabled ? openUrlInAppBrowser(url) : openUrl(url);
  }, [url, isInAppBrowserEnabled, openUrlInAppBrowser]);

  return { url, handlePress };
};
