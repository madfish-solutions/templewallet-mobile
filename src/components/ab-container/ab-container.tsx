import React, { FC, ReactNode } from 'react';

import { ABTestGroup } from '../../apis/temple-wallet';
import { useUserTestingGroupNameSelector } from '../../store/ab-testing/ab-testing-selectors';

interface ABContainerProps {
  groupAComponent: ReactNode;
  groupBComponent: ReactNode;
}

export const ABContainer: FC<ABContainerProps> = ({ groupAComponent, groupBComponent }) => {
  const abGroup = useUserTestingGroupNameSelector();

  return abGroup === ABTestGroup.B ? <>{groupBComponent}</> : <>{groupAComponent}</>;
};
