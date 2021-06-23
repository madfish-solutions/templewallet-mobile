import { AppMetadata } from '@airgap/beacon-sdk';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AppMetadataIcon } from '../../../../../components/app-metadata-icon/app-metadata-icon';
import { Divider } from '../../../../../components/divider/divider';
import { Icon } from '../../../../../components/icon/icon';
import { IconNameEnum } from '../../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../../styles/format-size';
import { useAppMetadataConnectionViewStyles } from './app-metadata-connection-view.styles';

interface Props {
  appMetadata: AppMetadata;
}

export const AppMetadataConnectionView: FC<Props> = ({ appMetadata }) => {
  const styles = useAppMetadataConnectionViewStyles();

  return (
    <>
      <Divider size={formatSize(16)} />
      <View style={styles.headerContainer}>
        <View style={styles.appContainer}>
          <AppMetadataIcon appMetadata={appMetadata} />
          <Divider size={formatSize(8)} />
          <Text style={styles.nameText}>{appMetadata.name}</Text>
        </View>
        <Divider size={formatSize(48)} />
        <Icon name={IconNameEnum.Link} size={formatSize(24)} />
        <Divider size={formatSize(48)} />
        <View style={styles.appContainer}>
          <View style={styles.templeLogoContainer}>
            <Icon name={IconNameEnum.TempleLogo} size={formatSize(22)} />
          </View>
          <Divider size={formatSize(8)} />
          <Text style={styles.nameText}>Temple</Text>
        </View>
      </View>
      <Divider size={formatSize(24)} />
      <Text style={styles.connectionText}>Would like to connect to your wallet</Text>
      <Divider size={formatSize(4)} />
      <Text style={styles.descriptionText}>
        This site is requesting access to view your account address. Always make sure you trust the sites you interact
        with.
      </Text>
    </>
  );
};
