import React, { FC } from 'react';

import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { HeaderButton } from '../header-button/header-button';

import { useHeaderCloseButtonStyles } from './styles';

export const HeaderCloseButton: FC = () => {
  const { goBack } = useNavigation();
  const styles = useHeaderCloseButtonStyles();

  return (
    <HeaderButton
      iconName={IconNameV2Enum.XBig}
      iconSize={12}
      size={formatSize(28)}
      style={styles.icon}
      onPress={goBack}
    />
  );
};
