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

const irregularPaddingByIconName: Partial<Record<IconNameV2Enum, Partial<Record<IconSize, number>>>> = {
  // TODO: Apply the same for other arrow icons
  [IconNameV2Enum.ArrowLeft]: {
    24: 4
  },
  // TODO: Apply the same for other chevron icons
  [IconNameV2Enum.ChevronRight]: {
    16: 2,
    24: 4
  },
  [IconNameV2Enum.Info]: {
    24: 3
  },
  [IconNameV2Enum.PlusBig]: {
    24: 2
  }
};

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

export const IconV2: FC<IconV2Props> = ({ name, size = 16, color, style, testID }) => {
  const { peach } = useColors();
  const Svg = IconNameV2Map[name];

  const scaleTransform = useMemo(() => {
    const padding = irregularPaddingByIconName[name]?.[size] ?? 1;
    const defaultSizePadding = irregularPaddingByIconName[name]?.[16] ?? 1;
    const scale = (size - 2 * padding) / (16 - 2 * defaultSizePadding);

    return scale === 1 ? undefined : [{ scale }];
  }, [size, name]);

  return (
    <View style={[style, sizeWrapperStyles.wrapper, sizeWrapperStyles[size]]}>
      <Svg transform={scaleTransform} color={color ?? peach} testID={testID} />
    </View>
  );
};
