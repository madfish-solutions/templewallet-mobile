import { AppMetadata } from '@airgap/beacon-sdk';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AvatarImage } from '../../../../../components/avatar-image/avatar-image';
import { Divider } from '../../../../../components/divider/divider';
import { RobotIcon } from '../../../../../components/robot-icon/robot-icon';
import { formatSize } from '../../../../../styles/format-size';
import { isDefined } from '../../../../../utils/is-defined';
import { useAppMetadataViewStyles } from './app-metadata-view.styles';

interface Props {
  appMetadata: AppMetadata;
}

export const AppMetadataView: FC<Props> = ({ appMetadata }) => {
  const styles = useAppMetadataViewStyles();

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <View style={styles.appContainer}>
        {isDefined(appMetadata.icon) ? (
          <AvatarImage uri={appMetadata.icon} size={formatSize(64)} />
        ) : (
          <RobotIcon seed={appMetadata.senderId} size={formatSize(64)} />
        )}
        <Divider size={formatSize(16)} />
        <View>
          <Divider size={formatSize(4)} />
          <Text style={styles.nameText}>{appMetadata.name}</Text>
          <Divider size={formatSize(4)} />
          <Text style={styles.descriptionText}>Request operations to you</Text>
        </View>
        <Divider />
      </View>
      <Divider size={formatSize(16)} />
    </View>
  );
};
