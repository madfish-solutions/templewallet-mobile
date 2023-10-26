import React, { FC } from 'react';
import { View } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';

import { useSplashModalStyles } from './splash-modal.styles';

export const SplashModal: FC = () => {
  const styles = useSplashModalStyles();

  return (
    <ScreenContainer style={styles.rootContainer} isFullScreenMode={true}>
      <View style={styles.container}>
        <Icon name={IconNameEnum.TempleLogoWithText} width={150} height={46.15} />
      </View>
    </ScreenContainer>
  );
};
