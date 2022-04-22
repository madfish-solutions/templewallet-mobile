import React, { FC } from 'react';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useRecentActionsSelector } from '../../store/debug/debug-selectors';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { ActionItem } from './action-item/action-item';
import { ImportWatchOnlyDebug } from './import-watch-only-debug/import-watch-only-debug';

export const Debug: FC = () => {
  const recentActions = useRecentActionsSelector();

  usePageAnalytic(ScreensEnum.Debug);

  const handleThrowErrorButtonsPress = () => {
    throw new Error('Test error from Debug screen');
  };

  return (
    <ScreenContainer>
      <ImportWatchOnlyDebug />
      <Divider size={formatSize(50)} />
      <ButtonMedium title="Throw Test Error" iconName={IconNameEnum.Alert} onPress={handleThrowErrorButtonsPress} />
      <Divider />

      {recentActions.map(({ timestamp, type, payload, id }) => (
        <ActionItem key={id} timestamp={timestamp} type={type} payload={payload} id={id} />
      ))}
    </ScreenContainer>
  );
};
