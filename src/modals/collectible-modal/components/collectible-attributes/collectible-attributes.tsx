import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { styles } from './collectible-attributes.styles';
import { CollectibleAttribute } from './components/collectible-attribute/collectible-attribute';

interface Props {
  attributes: {
    attribute: {
      name: string;
      value: string;
    };
  }[];
  style?: StyleProp<ViewStyle>;
}

export const CollectibleAttributes: FC<Props> = ({ attributes, style }) => {
  return (
    <View style={[styles.root, style]}>
      {attributes.map(({ attribute }, index) => (
        <CollectibleAttribute
          key={attribute.name}
          name={attribute.name}
          value={attribute.value}
          rarity={10}
          style={[index % 2 === 0 && styles.even]}
        />
      ))}
    </View>
  );
};
