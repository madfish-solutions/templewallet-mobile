import React, { memo, useCallback } from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AppMetadataIcon } from 'src/components/app-metadata-icon/app-metadata-icon';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { DAppConnection } from 'src/interfaces/dapp-connection.interface';
import { removeConnectionAction } from 'src/store/d-apps/d-apps-actions';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isString } from 'src/utils/is-string';

import { DAppsSettingsSelectors } from '../d-apps.settings.selectors';

import { ConnectionItemAnalyticsEvents } from './analytics-events';
import { ConnectionItemSelectors } from './selectors';
import { useConnectionItemStyles } from './styles';

interface Props {
  connection: DAppConnection;
}

export const ConnectionItem = memo<Props>(({ connection }) => {
  const styles = useConnectionItemStyles();
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const removeConnectionHandler = useCallback(
    () =>
      Alert.alert('Delete connection? ', 'You can reconnect to this DApp later.', [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () =>
            trackEvent(ConnectionItemAnalyticsEvents.DELETE_CONNECTION_CANCEL, AnalyticsEventCategory.General)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(removeConnectionAction(connection));
            trackEvent(ConnectionItemAnalyticsEvents.DELETE_CONNECTION_SUCCESS, AnalyticsEventCategory.General);
          }
        }
      ]),
    [connection, dispatch, trackEvent]
  );

  const protocolLabel = connection.protocol === DAppConnectionProtocol.WalletConnect ? 'WalletConnect' : 'Beacon';

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <AppMetadataIcon iconUri={connection.iconUri} iconSeed={connection.iconSeed} size={formatSize(44)} />
        <Divider size={formatSize(8)} />
        <View>
          <Text style={styles.nameText}>{connection.name}</Text>
          <Divider size={formatSize(4)} />
          <Text style={styles.networkText}>
            Network: <Text style={styles.networkValue}>{connection.networkLabel}</Text>
          </Text>
          <Divider size={formatSize(4)} />
          <Text style={styles.networkText}>
            Protocol: <Text style={styles.networkValue}>{protocolLabel}</Text>
          </Text>
          {isString(connection.accountAddress) && (
            <>
              <Divider size={formatSize(4)} />
              <PublicKeyHashText
                publicKeyHash={connection.accountAddress}
                testID={ConnectionItemSelectors.accountAddress}
              />
            </>
          )}
        </View>
      </View>
      <TouchableIcon
        name={IconNameEnum.Trash}
        size={formatSize(16)}
        style={styles.trashIcon}
        onPress={removeConnectionHandler}
        testID={DAppsSettingsSelectors.trashButton}
      />
    </View>
  );
});
