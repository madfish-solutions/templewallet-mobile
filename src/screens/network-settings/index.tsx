import React from 'react';
import { StyleSheet } from 'react-native';

import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/use-evm-chains.hook';
import { useTezosChain } from 'src/hooks/use-tezos-chains.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { ChainId, ChainOfKind } from 'src/types/networks';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { NetworkSettingsLayout } from './network-settings-layout';

export const NetworkSettings = () => {
  const { chainId } = useScreenParams<ScreensEnum.NetworkSettings>();

  usePageAnalytic(ScreensEnum.NetworkSettings);

  return (
    <ScreenContainer style={styles.container}>
      {typeof chainId === 'number' ? (
        <EvmNetworkSettingsContent chainId={chainId} />
      ) : (
        <TezosNetworkSettingsContent chainId={chainId} />
      )}
    </ScreenContainer>
  );
};

const NetworkSettingsContentHOC = <T extends TempleChainKind>(
  useChain: (chainId: ChainId<T>) => ChainOfKind<T> | undefined
) => {
  const NetworkSettings = (props: { chainId: ChainId<T> }) => {
    const chain = useChain(props.chainId);

    if (!chain) {
      return null;
    }

    return (
      <NetworkSettingsLayout
        activeBlockExplorerId={chain.activeBlockExplorer.id}
        blockExplorers={chain.allBlockExplorers}
        activeRpcEndpointId={chain.activeRpc.id}
        rpcEndpoints={chain.allRpcs}
      />
    );
  };

  return NetworkSettings;
};

const EvmNetworkSettingsContent = NetworkSettingsContentHOC<TempleChainKind.EVM>(useEvmChain);
const TezosNetworkSettingsContent = NetworkSettingsContentHOC<TempleChainKind.Tezos>(useTezosChain);
const styles = StyleSheet.create({
  container: {
    paddingTop: formatSize(16)
  }
});
