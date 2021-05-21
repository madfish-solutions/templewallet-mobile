import CheckBox, { CheckBoxProps } from '@react-native-community/checkbox';
import React, { FC } from 'react';
import { View } from 'react-native';

import { isIOS } from '../../config/system';
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
        {...(isIOS && { boxType: 'square', animationDuration: 0.15 })}
        style={{ width: size, height: size }}
        lineWidth={formatSize(1.5)}
        tintColor={colors.orange}
        onCheckColor={colors.orange}
        onTintColor={colors.orange}
      />
    </View>
  );
};
