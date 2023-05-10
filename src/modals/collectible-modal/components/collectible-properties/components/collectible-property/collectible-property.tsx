import React, { FC, isValidElement } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useCollectiblePropertyStyles } from './collectible-property.styles';

interface Props {
  name: string;
  value: JSX.Element | number | string | null;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleProperty: FC<Props> = ({ name, value, style }) => {
  const styles = useCollectiblePropertyStyles();

  return (
    <View style={[styles.root, style]}>
      <Text style={styles.name}>{name}</Text>
      {isValidElement(value) ? value : <Text style={styles.value}>{value}</Text>}
    </View>
  );
};
