import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { styles } from './collectible-attributes.styles';
import { CollectibleAttribute } from './components/collectible-attribute/collectible-attribute';

interface Props {
  attributes: {
    attribute: {
      id: number;
      name: string;
      value: string;
      rarity?: number;
    };
  }[];
  style?: StyleProp<ViewStyle>;
}

export const CollectibleAttributes: FC<Props> = ({ attributes, style }) => {
  return (
    <View style={[styles.root, style]}>
      {attributes.map(({ attribute }) => (
        <CollectibleAttribute
          key={attribute.name}
          name={attribute.name}
          value={attribute.value}
          rarity={attribute.rarity ?? 0}
        />
      ))}
    </View>
  );
};
