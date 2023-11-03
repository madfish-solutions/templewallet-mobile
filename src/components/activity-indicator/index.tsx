import React, { FC } from 'react';
import {
  ActivityIndicator as ActivityIndicatorComponent,
  ActivityIndicatorProps,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import { styles } from './styles';

interface Props extends ActivityIndicatorProps {
  style?: StyleProp<ViewStyle>;
}

export const ActivityIndicator: FC<Props> = ({ size = 'large', style }) => (
  <View style={[styles.root, style]}>
    <ActivityIndicatorComponent size={size} />
  </View>
);
