import { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { IconNameV2Enum } from './icon-name.enum';
import { IconNameV2Map } from './icon-name.map';

type IconSize = 12 | 16 | 24 | 32;

export interface IconV2Props extends TestIdProps, Omit<SvgProps, 'width' | 'height'> {
  name: IconNameV2Enum;
  size?: IconSize;
}

const regularPaddingSizes: Record<IconSize, number> = {
  12: 1,
  16: 1,
  24: 4,
  32: 1
};

const irregularPaddingByIconName: Partial<Record<IconNameV2Enum, Partial<Record<IconSize, number>>>> = {
  // TODO: Apply the same for other single arrow icons
  [IconNameV2Enum.ArrowLeft]: {
    24: 4.742
  },
  [IconNameV2Enum.ArrowDown]: {
    24: 4.742
  },
  [IconNameV2Enum.ArrowUp]: {
    24: 4.742
  },
  // TODO: Apply the same for other single chevron icons
  [IconNameV2Enum.ChevronRight]: {
    16: 2,
    24: 5.219
  },
  [IconNameV2Enum.Copy]: {
    24: 3.458
  },
  [IconNameV2Enum.DropdownDown]: {
    16: 2,
    24: 4.775
  },
  [IconNameV2Enum.Notification]: {
    24: 3
  },
  [IconNameV2Enum.Settings]: {
    24: 3
  },
  [IconNameV2Enum.Dollar]: {
    24: 2.645
  },
  [IconNameV2Enum.Import]: {
    24: 3.239
  },
  [IconNameV2Enum.UserAdd]: {
    16: 0,
    24: 2.024
  }
};

const getPadding = (size: IconSize, name: IconNameV2Enum) =>
  irregularPaddingByIconName[name]?.[size] ?? regularPaddingSizes[size];

const makeSizeWrapperStyles = (size: IconSize) => ({
  width: formatSize(size),
  height: formatSize(size)
});

const sizeWrapperStyles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  12: makeSizeWrapperStyles(12),
  16: makeSizeWrapperStyles(16),
  24: makeSizeWrapperStyles(24),
  32: makeSizeWrapperStyles(32)
});

const DEFAULT_SIZE = 16 as const;

export const IconV2: FC<IconV2Props> = ({ name, size = DEFAULT_SIZE, color, style, testID }) => {
  const { peach } = useColors();
  const Svg = IconNameV2Map[name];

  const internalSize = useMemo(() => {
    const padding = getPadding(size, name);
    const defaultSizePadding = getPadding(DEFAULT_SIZE, name);

    return ((size - 2 * padding) * formatSize(DEFAULT_SIZE)) / (DEFAULT_SIZE - 2 * defaultSizePadding);
  }, [size, name]);

  return (
    <View style={[style, sizeWrapperStyles.wrapper, sizeWrapperStyles[size]]}>
      <Svg width={internalSize} height={internalSize} color={color ?? peach} testID={testID} />
    </View>
  );
};
