import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AvatarImage } from 'src/components/avatar-image/avatar-image';
import { Divider } from 'src/components/divider/divider';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { formatSize } from 'src/styles/format-size';
import { isString } from 'src/utils/is-string';

import { useAppMetadataViewStyles } from './styles';

interface Props {
  name: string;
  iconUri?: string;
  iconSeed: string;
  description?: string;
}

const iconSize = formatSize(64);

export const AppMetadataView: FC<Props> = ({ name, iconUri, iconSeed, description = 'Request operations to you' }) => {
  const styles = useAppMetadataViewStyles();

  return (
    <View style={styles.container}>
      <Divider size={formatSize(8)} />
      <View style={styles.appContainer}>
        {isString(iconUri) ? (
          <AvatarImage uri={iconUri} size={iconSize} />
        ) : (
          <RobotIcon seed={iconSeed} size={iconSize} />
        )}
        <Divider size={formatSize(16)} />
        <View>
          <Divider size={formatSize(4)} />
          <Text style={styles.nameText}>{name}</Text>
          <Divider size={formatSize(4)} />
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
        <Divider />
      </View>
      <Divider size={formatSize(16)} />
    </View>
  );
};
