import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { WhiteContainer } from '../../../components/white-container/white-container';
import { WhiteContainerDivider } from '../../../components/white-container/white-container-divider/white-container-divider';
import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { useBackupSettingsStyles } from './backup.styles';

interface Props {
  onPress: EmptyFn;
}

export const Backup: FC<Props> = ({ onPress }) => {
  const colors = useColors();
  const styles = useBackupSettingsStyles();

  return (
    <ScreenContainer>
      <Divider size={formatSize(8)} />
      <WhiteContainer>
        <View style={styles.rootContainer}>
          <Icon name={IconNameEnum.Info} size={formatSize(32)} color={colors.destructive} />
          <Divider size={formatSize(12)} />
          <Text style={styles.title}>Your wallet is not backed up</Text>
          <Divider size={formatSize(12)} />
          <Text style={styles.description}>
            Don’t risk your money! Backup your wallet so you can recover it if you lose this device.
          </Text>
        </View>
        <WhiteContainerDivider />
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
          <Text style={styles.button}>Backup manually</Text>
        </TouchableOpacity>
      </WhiteContainer>
    </ScreenContainer>
  );
};
