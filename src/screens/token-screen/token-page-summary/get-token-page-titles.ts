import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';

interface TokenTitlesSource {
  name: string;
  symbol: string;
  chainKind: TempleChainKind;
}

export const getNetworkLabel = (chainKind: TempleChainKind) =>
  chainKind === TempleChainKind.Tezos ? 'Tezos' : ETHERLINK_MAINNET_CHAIN_SPECS.name;

export const getTokenPageTitles = ({ name, symbol, chainKind }: TokenTitlesSource) => {
  const networkLabel = getNetworkLabel(chainKind);
  const identityTitle = name === networkLabel ? symbol : name;

  return { identityTitle, headerTitle: identityTitle === name ? symbol : name, networkLabel };
};
