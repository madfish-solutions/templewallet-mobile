import React from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonMedium } from 'src/components/button/button-medium/button-medium';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { isIOS } from 'src/config/system';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useSetPasswordScreensCommonStyles } from 'src/styles/set-password-screens-common-styles';
import { showWarningToast } from 'src/toast/toast.utils';

import { CloudBackupNotFoundSelectors } from './selectors';
import { useBackupNotFoundStyles } from './styles';

interface Props {
  retry: EmptyFn;
}

export const BackupNotFound = ({ retry }: Props) => {
  const { navigate } = useNavigation();

  const commonStyles = useSetPasswordScreensCommonStyles();
  const styles = useBackupNotFoundStyles();

  const onCreateNewWalletBtnPress = () => {
    navigate(ScreensEnum.CreateAccount, { backupToCloud: true });
    showWarningToast({ description: 'Cloud backup will be made right after wallet creation automatically' });
  };

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <View style={styles.content}>
          <Icon name={IconNameEnum.NoResult} size={formatSize(120)} />

          <Text style={styles.text}>Backup is not found</Text>

          <View style={styles.retryBtnContainer}>
            <ButtonMedium
              title="RETRY"
              iconName={IconNameEnum.RetryIcon}
              onPress={retry}
              testID={CloudBackupNotFoundSelectors.retryButton}
            />
          </View>
        </View>

        {isIOS && (
          <Disclaimer
            title="Note"
            texts={[
              "iCloud may fail to sync initially. If you are sure to have made backup before, please click 'Retry'."
            ]}
          />
        )}
      </ScreenContainer>

      <View style={commonStyles.fixedButtonContainer}>
        <ButtonLargePrimary
          title="Create a new Wallet"
          onPress={onCreateNewWalletBtnPress}
          testID={CloudBackupNotFoundSelectors.createNewWalletButton}
        />
      </View>

      <InsetSubstitute type="bottom" />
    </>
  );
};
