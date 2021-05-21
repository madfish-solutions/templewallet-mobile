import CheckBox, { CheckBoxProps } from '@react-native-community/checkbox';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { isIOS } from '../../config/system';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';

interface Props extends CheckBoxProps {
  size: number;
}

export const StyledCheckbox: FC<Props> = ({ size = 20, ...props }) => {
  const colors = useColors();
  const styleProps: CheckBoxProps = useMemo(
    () =>
      isIOS
        ? {
            boxType: 'square',
            animationDuration: 0.15
          }
        : {},
    []
  );

  return (
    <View>
      <CheckBox
        {...props}
        {...styleProps}
        style={{ width: size, height: size }}
        lineWidth={formatSize(1.5)}
        tintColor={colors.orange}
        onCheckColor={colors.orange}
        onTintColor={colors.orange}
      />
    </View>
  );
};
