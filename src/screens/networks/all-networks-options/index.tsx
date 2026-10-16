import { memo, useCallback } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChains } from 'src/hooks/evm/use-evm-chains.hook';
import { useTezosChains } from 'src/hooks/use-tezos-chains.hook';
import { formatSize } from 'src/styles/format-size';
import { ChainId, ChainOfKind } from 'src/types/networks';

import { NetworksSelectors } from '../selectors';

import { useAllNetworksOptionsStyles } from './styles';

interface AllNetworksOptionsProps {
  onSelect: SyncFn<ChainId>;
}

export const AllNetworksOptions = memo<AllNetworksOptionsProps>(({ onSelect }) => {
  const styles = useAllNetworksOptionsStyles();

  const evmChains = useEvmChains();
  const tezosChains = useTezosChains();

  return (
    <View style={styles.container}>
      {tezosChains.map(chain => (
        <TezosNetworkOption key={chain.chainId} chain={chain} onClick={onSelect} />
      ))}
      {evmChains.map(chain => (
        <EvmNetworkOption key={chain.chainId} chain={chain} onClick={onSelect} />
      ))}
    </View>
  );
});

interface AllNetworksOptionProps<T extends TempleChainKind> {
  chain: ChainOfKind<T>;
  onClick: SyncFn<ChainId<T>>;
}

const AllNetworksOptionHOC = <T extends TempleChainKind>(
  NetworkIcon: React.ComponentType<{ chainId: ChainId<T>; size: number; style: StyleProp<ViewStyle> }>
) => {
  const AllNetworksOption = memo<AllNetworksOptionProps<T>>(({ chain, onClick }) => {
    const styles = useAllNetworksOptionsStyles();
    const { name, chainId } = chain;

    const handlePress = useCallback(() => onClick(chainId), [chainId, onClick]);

    return (
      <TouchableWithAnalytics
        style={styles.option}
        onPress={handlePress}
        testID={NetworksSelectors.networkOption}
        testIDProperties={{ network: chainId }}
      >
        <NetworkIcon chainId={chainId} size={formatSize(36)} style={styles.optionIcon} />
        <Text style={styles.optionName}>{name}</Text>
        <IconV2 name={IconNameV2Enum.ChevronRight} size={24} />
      </TouchableWithAnalytics>
    );
  });

  return AllNetworksOption;
};

const TezosNetworkOption = AllNetworksOptionHOC<TempleChainKind.Tezos>(({ size, style }) => (
  <CryptoLogo name={CryptoLogoNameEnum.Tezos} size={size} style={style} />
));

// TODO: Add icons for other EVM chains
const EvmNetworkOption = AllNetworksOptionHOC<TempleChainKind.EVM>(({ size, style }) => (
  <CryptoLogo name={CryptoLogoNameEnum.Etherlink} size={size} style={style} />
));
