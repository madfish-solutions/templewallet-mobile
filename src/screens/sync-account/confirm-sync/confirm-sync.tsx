import React from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { HeaderTitle } from '../../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { useConfirmSyncStyles } from './confirm-sync.styles';

export const ConfirmSync = () => {
  const { navigate } = useNavigation();
  const styles = useConfirmSyncStyles();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />
    },
    []
  );

  return (
    <>
      <View>
        <Text>Steps to sync with Temple Wallet extension</Text>
      </View>
    </>
  );
};
