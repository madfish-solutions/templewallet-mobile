import React, { FC } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { useCollectibleAttributeStyles } from './collectible-attribute.styles';

interface Props {
  name: string;
  value: string;
  rarity: number;
  style?: StyleProp<ViewStyle>;
}

export const CollectibleAttribute: FC<Props> = ({ name, value, rarity, style }) => {
  const styles = useCollectibleAttributeStyles();

  return (
    <View style={[styles.root, style]}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.rarity}>{`${rarity}%`}</Text>
    </View>
  );
};
