import React, { FC } from 'react';
import { RefreshControl as RNRefreshControl, RefreshControlProps } from 'react-native';

import { useColors } from 'src/styles/use-colors';

export const RefreshControl: FC<RefreshControlProps> = props => {
  const { gray2 } = useColors();

  return <RNRefreshControl tintColor={gray2} colors={[gray2]} {...props} />;
};
