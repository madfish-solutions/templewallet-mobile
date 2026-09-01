import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChainsSpecsSelector } from 'src/store/settings/settings-selectors';
import {
  ChainRef,
  DEFAULT_MAINNET_TEZOS_CHAIN_SPECS,
  ETHERLINK_MAINNET_CHAIN_SPECS,
  EvmChainSpecs
} from 'src/types/networks';

interface TokenTitlesSource {
  name: string;
  symbol: string;
}

export const findNetworkLabel = (evmChainsSpecs: EvmChainSpecs[], chainRef: ChainRef) => {
  if (chainRef.chainKind === TempleChainKind.Tezos) {
    return DEFAULT_MAINNET_TEZOS_CHAIN_SPECS.name;
  }

  return evmChainsSpecs.find(specs => specs.chainId === chainRef.chainId)?.name ?? ETHERLINK_MAINNET_CHAIN_SPECS.name;
};

export const useNetworkLabel = (chainRef: ChainRef) => {
  const evmChainsSpecs = useEvmChainsSpecsSelector();

  return findNetworkLabel(evmChainsSpecs, chainRef);
};

export const getTokenPageTitles = ({ name, symbol }: TokenTitlesSource, networkLabel: string) => {
  const identityTitle = name === networkLabel ? symbol : name;
  const headerTitle = name === networkLabel ? name : symbol;

  return { identityTitle, headerTitle, networkLabel };
};

export const useTokenPageTitles = (source: TokenTitlesSource & ChainRef) => {
  const networkLabel = useNetworkLabel(source);

  return getTokenPageTitles(source, networkLabel);
};
