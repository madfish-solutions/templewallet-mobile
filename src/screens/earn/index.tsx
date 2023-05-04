import React, { FC } from 'react';
import { Text } from 'react-native';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

export const Earn: FC = () => {
  usePageAnalytic(ScreensEnum.Earn);

  return <Text>TODO: add options to this page</Text>;
};
