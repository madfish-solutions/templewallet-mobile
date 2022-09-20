import React, { FC } from 'react';
import { View } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { formatSize } from '../../styles/format-size';
import { useSplashModalStyles } from './splash-modal.styles';

export const SplashModal: FC = () => {
  const styles = useSplashModalStyles();

  return (
    <ScreenContainer style={styles.rootContainer} isFullScreenMode={true}>
      <View style={styles.container}>
        <Icon name={IconNameEnum.TempleLogoWithText} width={formatSize(208)} height={formatSize(64)} />
      </View>
    </ScreenContainer>
  );
};
