import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { verifySeedPhrase } from '../../store/security/security-actions';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { ImportWatchOnlyDebug } from './import-watch-only-debug/import-watch-only-debug';

export const Debug: FC = () => {
  const dispatch = useDispatch();
  usePageAnalytic(ScreensEnum.Debug);

  const handleThrowErrorButtonsPress = () => {
    throw new Error('Test error from Debug screen');
  };

  const handleUnverified = () => {
    dispatch(verifySeedPhrase(false));
  };

  return (
    <ScreenContainer>
      <ImportWatchOnlyDebug />
      <Divider size={formatSize(50)} />
      <ButtonMedium title="Set unverified" iconName={IconNameEnum.Alert} onPress={handleUnverified} />
      <ButtonMedium title="Throw Test Error" iconName={IconNameEnum.Alert} onPress={handleThrowErrorButtonsPress} />
      <Divider />
    </ScreenContainer>
  );
};
