import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { WhiteContainerDivider } from 'src/components/white-container/white-container-divider/white-container-divider';
import { isIOS } from 'src/config/system';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { useIsBackupMadeSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useBackupStyles } from './backup.styles';
import { EraseCloudBackupButton } from './EraseCloudBackupButton';

const iconSize = formatSize(32);

export const Backup = () => {
  const colors = useColors();
  const styles = useBackupStyles();
  const navigateToScreen = useNavigateToScreen();

  const account = useSelectedAccountSelector();
  const { isManualBackupMade } = useIsBackupMadeSelector();

  usePageAnalytic(ScreensEnum.Backup);

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

          <TouchableOpacity
            style={styles.actionButtonContainer}
            onPress={() => navigateToScreen({ screen: ScreensEnum.ManualBackup })}
          >
            <Text style={styles.actionButtonText}>Backup manually</Text>
          </TouchableOpacity>
        </WhiteContainer>
      )}

      <Divider />

      {isIOS && account.type === AccountTypeEnum.WATCH_ONLY_DEBUG && <EraseCloudBackupButton />}
    </ScreenContainer>
  );
};
