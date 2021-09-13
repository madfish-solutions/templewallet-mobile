import React, { FC } from 'react';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useRecentActionsSelector } from '../../store/debug/debug-selectors';
import { ActionItem } from './action-item/action-item';

export const Debug: FC = () => {
  const recentActions = useRecentActionsSelector();

  const handleThrowErrorButtonsPress = () => {
    throw new Error('Test error from Debug screen');
  };

  return (
    <ScreenContainer>
      <ButtonMedium title="Throw Test Error" iconName={IconNameEnum.Alert} onPress={handleThrowErrorButtonsPress} />
      <Divider />

      {recentActions.map(({ timestamp, type, payload, id }) => (
        <ActionItem key={id} timestamp={timestamp} type={type} payload={payload} id={id} />
      ))}
    </ScreenContainer>
  );
};
