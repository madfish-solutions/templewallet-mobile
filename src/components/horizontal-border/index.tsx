import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { isAndroid } from 'src/config/system';
import { useColors } from 'src/styles/use-colors';

import { useHorizontalBorderStyles } from './styles';

interface Props {
  style?: StyleProp<ViewStyle>;
  width?: number;
  color?: string;
}

export const HorizontalBorder: FC<Props> = ({ style, width = DEFAULT_BORDER_WIDTH, color }) => {
  const colors = useColors();
  const styles = useHorizontalBorderStyles();
  const colorWithDefault = color ?? colors.lines;

  return (
    <View
      style={[
        styles.root,
        isAndroid
          ? { borderBottomWidth: width, borderColor: colorWithDefault }
          : { height: width, backgroundColor: colorWithDefault },
        style
      ]}
    />
  );
};
