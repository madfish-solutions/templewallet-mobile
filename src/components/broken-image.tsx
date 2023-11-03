import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';

interface Props {
  isBigIcon: boolean;
  style?: StyleProp<ViewStyle>;
}

const STYLE: StyleProp<ViewStyle> = {
  justifyContent: 'center',
  alignItems: 'center'
};

export const BrokenImage: FC<Props> = ({ isBigIcon, style }) => (
  <View style={[STYLE, style]}>
    <Icon
      name={IconNameEnum.BrokenImage}
      width={formatSize(isBigIcon ? 72 : 38)}
      height={formatSize(isBigIcon ? 90 : 48)}
    />
  </View>
);
