import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { isAndroid } from 'src/config/system';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useHorizontalBorderStyles } from './styles';

interface Props {
  style?: StyleProp<ViewStyle>;
  width?: number;
  color?: string;
}

export const HorizontalBorder: FC<Props> = ({ style, width = formatSize(0.5), color }) => {
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
