import { PermissionInfo } from '@airgap/beacon-sdk';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AppMetadataIcon } from '../../../components/app-metadata-icon/app-metadata-icon';
import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { PublicKeyHashText } from '../../../components/public-key-hash-text/public-key-hash-text';
import { removePermissionAction } from '../../../store/d-apps/d-apps-actions';
import { formatSize } from '../../../styles/format-size';
import { usePermissionItemStyles } from './permission-item.styles';

interface Props {
  permission: PermissionInfo;
}

export const PermissionItem: FC<Props> = ({ permission }) => {
  const styles = usePermissionItemStyles();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <AppMetadataIcon appMetadata={permission.appMetadata} />
        <Divider size={formatSize(8)} />
        <View>
          <Text style={styles.nameText}>{permission.appMetadata.name}</Text>
          <Divider size={formatSize(4)} />
          <Text style={styles.networkText}>
            Network: <Text style={styles.networkValue}>{permission.network.type}</Text>
          </Text>
          <Divider size={formatSize(4)} />
          <PublicKeyHashText publicKeyHash={permission.publicKey} />
        </View>
      </View>
      <TouchableIcon
        name={IconNameEnum.Trash}
        size={formatSize(16)}
        onPress={() => dispatch(removePermissionAction(permission))}
      />
    </View>
  );
};
