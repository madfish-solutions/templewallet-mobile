import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { formatSize } from '../../../../styles/format-size';
import { Icon } from '../../../icon/icon';
import { IconNameEnum } from '../../../icon/icon-name.enum';
import { getBrokenImageSize } from '../../utils/get-broken-image-size';

interface Props {
  isBigIcon: boolean;
  style?: StyleProp<ViewStyle>;
}

export const BrokenImage: FC<Props> = ({ isBigIcon, style }) => {
  const brokenImageSize = getBrokenImageSize(isBigIcon);

  return (
    <View style={style}>
      <Icon
        name={IconNameEnum.BrokenImage}
        width={formatSize(brokenImageSize.width)}
        height={formatSize(brokenImageSize.height)}
      />
    </View>
  );
};
