import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export const useLayoutSizes = (defaultWidth = 100, defaultHeight = 100) => {
  const [layoutWidth, setLayoutWidth] = useState(defaultWidth);
  const [layoutHeight, setLayoutHeight] = useState(defaultHeight);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setLayoutWidth(nativeEvent.layout.width);
    setLayoutHeight(nativeEvent.layout.height);
  };

  return { layoutWidth, layoutHeight, handleLayout };
};
