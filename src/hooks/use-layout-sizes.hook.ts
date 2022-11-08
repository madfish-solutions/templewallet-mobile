import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export const useLayoutSizes = () => {
  const [layoutWidth, setLayoutWidth] = useState(100);
  const [layoutHeight, setLayoutHeight] = useState(100);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setLayoutWidth(nativeEvent.layout.width || 1);
    setLayoutHeight(nativeEvent.layout.height || 1);
  };

  return { layoutWidth, layoutHeight, handleLayout };
};
