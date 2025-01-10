import React, { memo } from 'react';
import { View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';

import { useSplashModalStyles } from './splash-modal.styles';

export const SplashModal = memo(() => {
  const styles = useSplashModalStyles();

  return (
    <ScreenContainer style={styles.rootContainer} isFullScreenMode={true}>
      <View style={styles.container}>
        <Icon name={IconNameEnum.TempleLogoWithText} width={150} height={46.15} />
      </View>
    </ScreenContainer>
  );
});
