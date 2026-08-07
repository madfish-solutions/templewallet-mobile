import React, { memo, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';

import { useColors } from 'src/styles/use-colors';

// The native indicator only draws at 20 ('small') or 36 ('large') - scaling bridges to the design sizes
const NATIVE_SMALL_SIZE = 20;
const NATIVE_LARGE_SIZE = 36;

interface Props {
  size: number;
}

export const ActivitySpinner = memo<Props>(({ size }) => {
  const colors = useColors();
  const isSmall = size <= 24;
  const nativeSize = isSmall ? NATIVE_SMALL_SIZE : NATIVE_LARGE_SIZE;

  const style = useMemo(
    () => ({ width: size, height: size, transform: [{ scale: size / nativeSize }] }),
    [size, nativeSize]
  );

  return <ActivityIndicator size={isSmall ? 'small' : 'large'} color={colors.gray1} style={style} />;
});
