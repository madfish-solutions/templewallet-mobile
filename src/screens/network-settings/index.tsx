import React from 'react';
import { StyleSheet } from 'react-native';

import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { NetworkSettingsLayout } from './network-settings-layout';

const layoutPropsByNetwork = {
  tezos: {
    rpcEndpoints: [{ id: 'tezos', title: 'Tezos', description: 'Default' }],
    blockExplorers: [{ id: 'tzkt', title: 'TzKT', description: 'https://tzkt.io' }],
    activeRpcEndpointId: 'tezos',
    activeBlockExplorerId: 'tzkt'
  },
  etherlink: {
    rpcEndpoints: [{ id: 'etherlink', title: 'Etherlink', description: 'Default RPC' }],
    blockExplorers: [{ id: 'etherlink', title: 'Etherlink explorer', description: 'https://explorer.etherlink.com' }],
    activeRpcEndpointId: 'etherlink',
    activeBlockExplorerId: 'etherlink'
  }
};

export const NetworkSettings = () => {
  const { network } = useScreenParams<ScreensEnum.NetworkSettings>();

  usePageAnalytic(ScreensEnum.NetworkSettings);

  return (
    <ScreenContainer style={styles.container}>
      <NetworkSettingsLayout {...layoutPropsByNetwork[network]} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: formatSize(16)
  }
});
