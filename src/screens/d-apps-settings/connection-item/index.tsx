import React, { memo, useCallback } from 'react';
import { Alert, View } from 'react-native';

import { AppMetadataIcon } from 'src/components/app-metadata-icon/app-metadata-icon';
import { getChainLogoName } from 'src/components/crypto-logo/utils';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { TruncatedText } from 'src/components/truncated-text';
import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { DAppConnection } from 'src/interfaces/dapp-connection.interface';
import { dispatch } from 'src/store';
import { removeConnectionAction } from 'src/store/d-apps/d-apps-actions';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { DAppsSettingsSelectors } from '../d-apps.settings.selectors';

import { ConnectionItemAnalyticsEvents } from './analytics-events';
import { useConnectionItemStyles } from './styles';

interface Props {
  connection: DAppConnection;
}

export const ConnectionItem = memo<Props>(({ connection }) => {
  const styles = useConnectionItemStyles();
  const { trackEvent } = useAnalytics();

  const isBeaconConnection = connection.protocol === DAppConnectionProtocol.Beacon;

  const handleDisconnectPress = useCallback(
    () =>
      Alert.alert(
        'Disconnect?',
        isBeaconConnection
          ? 'All accounts connected to this Dapp will be disconnected. You can reconnect to it later.'
          : 'You can reconnect to this Dapp later.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () =>
              trackEvent(ConnectionItemAnalyticsEvents.DeleteConnectionCancel, AnalyticsEventCategory.General)
          },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: () => {
              dispatch(removeConnectionAction(connection));
              trackEvent(ConnectionItemAnalyticsEvents.DeleteConnectionSuccess, AnalyticsEventCategory.General);
            }
          }
        ]
      ),
    [connection, isBeaconConnection, trackEvent]
  );

  const chainKind = isBeaconConnection ? TempleChainKind.Tezos : TempleChainKind.EVM;

  return (
    <View style={styles.root}>
      <AppMetadataIcon
        iconUri={connection.iconUri}
        iconSeed={connection.iconSeed}
        size={formatSize(36)}
        style={styles.logo}
      />
      <View style={styles.info}>
        <TruncatedText style={styles.name}>{connection.name}</TruncatedText>
        <View style={styles.networkRow}>
          <TruncatedText style={styles.networkLabel}>{connection.networkLabel}</TruncatedText>
          <NetworkIcon name={getChainLogoName(chainKind)} variant="compactTransparent" />
        </View>
      </View>
      <TouchableIconV2
        name={IconNameV2Enum.LinkNo}
        size={formatSize(24)}
        iconSize={16}
        onPress={handleDisconnectPress}
        testID={DAppsSettingsSelectors.disconnectButton}
      />
    </View>
  );
});
