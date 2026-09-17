import React, { useCallback, useEffect, useMemo } from 'react';
import { Alert, FlatList, ListRenderItem, Text, View } from 'react-native';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Switch } from 'src/components/switch/switch';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { WhiteContainerAction } from 'src/components/white-container/white-container-action/white-container-action';
import { WhiteContainerText } from 'src/components/white-container/white-container-text/white-container-text';
import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { DAppConnection } from 'src/interfaces/dapp-connection.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { dispatch } from 'src/store';
import { loadConnectionsActions, removeConnectionsAction } from 'src/store/d-apps/d-apps-actions';
import { useSelectedAccountConnectionsSelector } from 'src/store/d-apps/d-apps-selectors';
import { setIsInAppBrowserEnabledAction } from 'src/store/settings/settings-actions';
import { useIsInAppBrowserEnabledSelector } from 'src/store/settings/settings-selectors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { DAppsSettingsAnalyticsEvents } from './analytics-events';
import { ConnectionItem } from './connection-item';
import { useDAppsSettingsStyles } from './d-apps-settings.styles';
import { DAppsSettingsSelectors } from './d-apps.settings.selectors';
import { DisconnectAllButton } from './disconnect-all-button';

const keyExtractor = (connection: DAppConnection) => connection.id;

const renderItem: ListRenderItem<DAppConnection> = ({ item }) => <ConnectionItem connection={item} />;

export const DAppsSettings = () => {
  const styles = useDAppsSettingsStyles();
  const { trackEvent } = useAnalytics();

  const connections = useSelectedAccountConnectionsSelector();
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();
  const hasConnections = connections.length > 0;

  usePageAnalytic(ScreensEnum.DAppsSettings);
  useEffect(() => void dispatch(loadConnectionsActions.submit()), []);

  const handleDisconnectAllPress = useCallback(() => {
    const hasBeaconConnections = connections.some(connection => connection.protocol === DAppConnectionProtocol.Beacon);

    Alert.alert(
      'Disconnect all?',
      hasBeaconConnections
        ? 'All accounts connected to these Tezos Dapps will be disconnected. You can reconnect to them later.'
        : 'You can reconnect to these Dapps later.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => trackEvent(DAppsSettingsAnalyticsEvents.DisconnectAllCancel, AnalyticsEventCategory.General)
        },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            dispatch(removeConnectionsAction(connections));
            trackEvent(DAppsSettingsAnalyticsEvents.DisconnectAllSuccess, AnalyticsEventCategory.General);
          }
        }
      ]
    );
  }, [connections, trackEvent]);

  const ListEmptyComponent = useMemo(() => <DataPlaceholder text="No connected DApps" />, []);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        {hasConnections && (
          <DisconnectAllButton onPress={handleDisconnectAllPress} testID={DAppsSettingsSelectors.disconnectAllButton} />
        )}
        <WhiteContainer>
          <WhiteContainerAction
            onPress={() => dispatch(setIsInAppBrowserEnabledAction(!isInAppBrowserEnabled))}
            testID={DAppsSettingsSelectors.inAppBrowserAction}
            testIDProperties={{ newValue: !isInAppBrowserEnabled }}
          >
            <WhiteContainerText text="Open with in-app browser" />
            <Switch
              value={isInAppBrowserEnabled}
              onChange={value => dispatch(setIsInAppBrowserEnabledAction(value))}
              testID={DAppsSettingsSelectors.inAppBrowserToggle}
            />
          </WhiteContainerAction>
        </WhiteContainer>
        {hasConnections && <Text style={styles.sectionLabel}>Connected Dapps</Text>}
      </View>
      <FlatList
        data={connections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={hasConnections ? styles.listContent : styles.emptyListContent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};
