import CheckBox, { CheckBoxProps } from '@react-native-community/checkbox';
import React, { FC } from 'react';
import { View } from 'react-native';

import { isAndroid, isIOS } from '../../config/system';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';

interface Props extends CheckBoxProps {
  size?: number;
}

export const StyledCheckbox: FC<Props> = ({ size = formatSize(20), ...props }) => {
  const colors = useColors();

  return (
    <View>
      <CheckBox
        {...props}
        {...(isIOS && {
          lineWidth: formatSize(1.5),
          boxType: 'square',
          tintColor: colors.orange,
          animationDuration: 0.15,
          onCheckColor: colors.orange,
          onTintColor: colors.orange
        })}
        {...(isAndroid && {
          tintColors: {
            true: colors.orange,
            false: colors.orange
          }
        })}
        style={{ width: size, height: size }}
      />
    </View>
  );
};
