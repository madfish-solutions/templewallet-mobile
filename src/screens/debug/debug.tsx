import React, { FC } from 'react';

import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useRecentActionsSelector } from '../../store/debug/debug-selectors';
import { ActionItem } from './action-item/action-item';

export const Debug: FC = () => {
  const recentActions = useRecentActionsSelector();

  return (
    <ScreenContainer>
      {recentActions.map(({ timestamp, type, payload, id }) => (
        <ActionItem key={id} timestamp={timestamp} type={type} payload={payload} id={id} />
      ))}
    </ScreenContainer>
  );
};
