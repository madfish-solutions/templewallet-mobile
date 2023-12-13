import React, { memo } from 'react';
import { View } from 'react-native';

import { LogoWithText } from 'src/components/icon/logo-with-text';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { formatSize } from 'src/styles/format-size';

import { useSplashModalStyles } from './splash-modal.styles';

export const SplashModal = memo(() => {
  const styles = useSplashModalStyles();

  return (
    <ScreenContainer style={styles.rootContainer} isFullScreenMode={true}>
      <View style={styles.container}>
        <LogoWithText width={formatSize(248)} height={formatSize(104)} />
      </View>
    </ScreenContainer>
  );
});
