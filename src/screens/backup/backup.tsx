import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { WhiteContainer } from '../../components/white-container/white-container';
import { WhiteContainerDivider } from '../../components/white-container/white-container-divider/white-container-divider';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useIsManualBackupMadeSelector } from '../../store/settings/settings-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { useBackupStyles } from './backup.styles';

const iconSize = formatSize(32);

export const Backup = () => {
  const colors = useColors();
  const styles = useBackupStyles();
  const { navigate } = useNavigation();

  const isManualBackupMade = useIsManualBackupMadeSelector();

  return (
    <ScreenContainer>
      {isManualBackupMade ? (
        <WhiteContainer>
          <View style={styles.infoContainer}>
            <Icon name={IconNameEnum.CheckCircle} color={colors.adding} width={iconSize} height={iconSize} />
            <Text style={styles.title}>Your wallet is backed up</Text>
            <Text style={styles.description}>
              If you lose this devise, you can restore your wallet with the seed phrase you saved.
            </Text>
          </View>
        </WhiteContainer>
      ) : (
        <WhiteContainer>
          <View style={styles.infoContainer}>
            <Icon name={IconNameEnum.AlertCircle} color={colors.destructive} width={iconSize} height={iconSize} />
            <Text style={styles.title}>Your wallet is not backed up</Text>
            <Text style={styles.description}>
              Don’t risk your money! Backup your wallet so you can recover it if you lose this device.
            </Text>
          </View>
          <WhiteContainerDivider />
          <TouchableOpacity style={styles.actionButtonContainer} onPress={() => navigate(ScreensEnum.ManualBackup)}>
            <Text style={styles.actionButtonText}>Backup manually</Text>
          </TouchableOpacity>
        </WhiteContainer>
      )}
    </ScreenContainer>
  );
};
