import React, { FC, memo } from 'react';
import { Text, View } from 'react-native';

import { CollectibleAttribute } from '../../types';
import { styles, useCollectibleAttributeStyles } from './styles';

interface Props {
  attributes: CollectibleAttribute[];
}

export const CollectibleAttributes = memo<Props>(({ attributes }) => (
  <View style={styles.root}>
    {attributes.map(({ attribute }) => (
      <CollectibleAttribute
        key={attribute.name}
        name={attribute.name}
        value={attribute.value}
        rarity={attribute.rarity ?? 0}
      />
    ))}
  </View>
));

interface CollectibleAttributeProps {
  name: string;
  value: string;
  rarity: number;
}

const CollectibleAttribute: FC<CollectibleAttributeProps> = ({ name, value, rarity }) => {
  const styles = useCollectibleAttributeStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.rarity}>{`${rarity}%`}</Text>
    </View>
  );
};
