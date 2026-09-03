import React from 'react';
import { PixelRatio, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { itemStyles } from './styles';

interface Props {
  selected: boolean;
  color: string;
  size?: number;
}

export const RadioCircle = ({ selected, color, size = formatSize(24) }: Props) => {
  const borderWidth = PixelRatio.roundToNearestPixel(size * 0.1);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  return (
    <View
      style={[
        itemStyles.border,
        {
          borderColor: color,
          borderWidth,
          width: sizeFull,
          height: sizeFull,
          borderRadius: sizeHalf
        }
      ]}
    >
      {selected && (
        <View
          style={{
            backgroundColor: color,
            width: sizeHalf,
            height: sizeHalf,
            borderRadius: sizeHalf
          }}
        />
      )}
    </View>
  );
};
