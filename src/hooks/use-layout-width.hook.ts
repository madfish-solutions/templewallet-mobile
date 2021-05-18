import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export const useLayoutWidth = () => {
  const [layoutWidth, setLayoutWidth] = useState(100);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => setLayoutWidth(nativeEvent.layout.width);

  return { layoutWidth, handleLayout };
};
