import React from 'react';

import { emptyFn } from '../../../config/general';
import { useColors } from '../../../styles/use-colors';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { HeaderButton } from '../header-button/header-button';

export const HeaderQrScannerButton = () => {
  const colors = useColors();

  return <HeaderButton iconName={IconNameEnum.QrScanner} color={colors.disabled} onPress={emptyFn} />;
};
