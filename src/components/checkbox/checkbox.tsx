import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Svg, Path, Rect } from 'react-native-svg';

import { EventFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { generateHitSlop } from '../../styles/generate-hit-slop';
import { useColors } from '../../styles/use-colors';
import { CheckboxStyles } from './checkbox.styles';

interface Props {
  disabled?: boolean;
  value: boolean;
  size?: number;
  strokeWidth?: number;
  onChange: EventFn<boolean>;
}

export const Checkbox: FC<Props> = ({
  disabled,
  value,
  size = formatSize(24),
  strokeWidth = formatSize(1.5),
  children,
  onChange
}) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={CheckboxStyles.container}
      activeOpacity={1}
      hitSlop={generateHitSlop(formatSize(4))}
      onPress={() => onChange(!value)}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="2.75"
          y="2.75"
          width="18.5"
          height="18.5"
          rx="2.25"
          stroke={disabled ? colors.gray1 : '#FF5B00'}
          strokeWidth={strokeWidth}
        />
        {value && (
          <Path
            d="M7 12.75L10 15.75L17.5 8"
            stroke="#FF5B00"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </Svg>
      {children}
    </TouchableOpacity>
  );
};
