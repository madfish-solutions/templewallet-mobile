import { PermissionInfo } from '@airgap/beacon-sdk';
import React, { FC } from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AppMetadataIcon } from 'src/components/app-metadata-icon/app-metadata-icon';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { removePermissionAction } from 'src/store/d-apps/d-apps-actions';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { DAppsSettingsSelectors } from '../d-apps.settings.selectors';

import { PermissionItemAnalyticsEvents } from './analytics-events';
import { usePermissionItemStyles } from './permission-item.styles';
import { PermissionItemSelectors } from './selectors';

interface Props {
  permission: PermissionInfo;
}

export const PermissionItem: FC<Props> = ({ permission }) => {
  const styles = usePermissionItemStyles();
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();
  const removePermissionHandler = () =>
    Alert.alert('Delete connection? ', 'You can reconnect to this DApp later.', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () =>
          trackEvent(PermissionItemAnalyticsEvents.DELETE_CONNECTION_CANCEL, AnalyticsEventCategory.General)
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(removePermissionAction(permission));
          trackEvent(PermissionItemAnalyticsEvents.DELETE_CONNECTION_SUCCESS, AnalyticsEventCategory.General);
        }
      }
    ]);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <AppMetadataIcon appMetadata={permission.appMetadata} size={formatSize(34)} />
        <Divider size={formatSize(8)} />
        <View>
          <Text style={styles.nameText}>{permission.appMetadata.name}</Text>
          <Divider size={formatSize(4)} />
          <Text style={styles.networkText}>
            Network: <Text style={styles.networkValue}>{permission.network.type}</Text>
          </Text>
          <Divider size={formatSize(4)} />
          <PublicKeyHashText publicKeyHash={permission.publicKey} testID={PermissionItemSelectors.publicKeyHash} />
        </View>
      </View>
      <TouchableIcon
        name={IconNameEnum.Trash}
        size={formatSize(16)}
        onPress={removePermissionHandler}
        testID={DAppsSettingsSelectors.trashButton}
      />
    </View>
  );
};
