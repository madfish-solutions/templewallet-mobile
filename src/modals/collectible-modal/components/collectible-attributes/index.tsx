import React, { FC, memo } from 'react';
import { Text, View } from 'react-native';

import { CollectibleAttribute } from '../../types';

import { styles, useCollectibleAttributeStyles } from './styles';

interface Props {
  attributes: CollectibleAttribute[];
}

export interface CollectibleAttributeCell {
  name: string;
  value: string;
  rarity?: number;
}

export const CollectibleAttributes = memo<Props>(({ attributes }) => (
  <CollectibleAttributeGrid
    attributes={attributes.map(({ attribute }) => ({
      name: attribute.name,
      value: attribute.value,
      rarity: attribute.rarity ?? 0
    }))}
  />
));

interface CollectibleAttributeGridProps {
  attributes: CollectibleAttributeCell[];
}

export const CollectibleAttributeGrid = memo<CollectibleAttributeGridProps>(({ attributes }) => (
  <View style={styles.root}>
    {attributes.map(({ name, value, rarity }, index) => (
      <CollectibleAttributeView key={`${name}-${index}`} name={name} value={value} rarity={rarity} />
    ))}
  </View>
));

interface CollectibleAttributeProps {
  name: string;
  value: string;
  rarity?: number;
}

const CollectibleAttributeView: FC<CollectibleAttributeProps> = ({ name, value, rarity }) => {
  const styles = useCollectibleAttributeStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.value}>{value}</Text>
      {rarity !== undefined ? <Text style={styles.rarity}>{`${rarity.toFixed(2)}%`}</Text> : null}
    </View>
  );
};
