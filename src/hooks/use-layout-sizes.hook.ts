import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export const useLayoutSizes = () => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const handleLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setLayoutWidth(nativeEvent.layout.width);
    setLayoutHeight(nativeEvent.layout.height);
  }, []);

  return { layoutWidth, layoutHeight, handleLayout };
};
