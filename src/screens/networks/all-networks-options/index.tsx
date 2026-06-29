import { memo, useCallback } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChains } from 'src/hooks/use-evm-chains.hook';
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
        <NetworkIcon chainId={chainId} size={formatSize(30)} style={styles.optionIcon} />
        <Text style={styles.optionName}>{name}</Text>
        <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
      </TouchableWithAnalytics>
    );
  });

  return AllNetworksOption;
};

const TezosNetworkOption = AllNetworksOptionHOC<TempleChainKind.Tezos>(({ size, style }) => (
  <Icon name={IconNameEnum.TezToken} size={size} style={style} />
));

// TODO: Add icons for other EVM chains
const EvmNetworkOption = AllNetworksOptionHOC<TempleChainKind.EVM>(({ size, style }) => (
  <Icon name={IconNameEnum.EtherlinkToken} size={size} style={style} />
));
