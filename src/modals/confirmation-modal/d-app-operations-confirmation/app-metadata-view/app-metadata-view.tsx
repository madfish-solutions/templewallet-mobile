import { AppMetadata } from '@airgap/beacon-sdk';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AppMetadataIcon } from '../../../../components/app-metadata-icon/app-metadata-icon';
import { Divider } from '../../../../components/divider/divider';
import { formatSize } from '../../../../styles/format-size';

import { useAppMetadataViewStyles } from './app-metadata-view.styles';

interface Props {
  appMetadata: AppMetadata;
}

const iconSize = formatSize(64);

export const AppMetadataView: FC<Props> = ({ appMetadata }) => {
  const styles = useAppMetadataViewStyles();

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <View style={styles.appContainer}>
        <AppMetadataIcon appMetadata={appMetadata} size={iconSize} />
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
