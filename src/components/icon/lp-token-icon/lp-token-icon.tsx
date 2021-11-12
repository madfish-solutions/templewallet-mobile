import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { LpTokenIconStyles } from './lp-token-icon.styles';

interface Props {
  firstTokenIcon: IconNameEnum;
  secondTokenIcon: IconNameEnum;
  containerStyles?: StyleProp<ViewStyle>;
}

export const LpTokenIcon: FC<Props> = ({ firstTokenIcon, secondTokenIcon, containerStyles }) => (
  <View style={[LpTokenIconStyles.container, containerStyles]}>
    <Icon size={formatSize(24)} style={LpTokenIconStyles.firstIcon} name={firstTokenIcon} />
    <Icon size={formatSize(24)} style={LpTokenIconStyles.secondIcon} name={secondTokenIcon} />
  </View>
);
