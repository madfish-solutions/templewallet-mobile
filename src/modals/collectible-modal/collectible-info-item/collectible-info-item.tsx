import React, { FC, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useCollectibleInfoItemStyles } from './collectible-info-item.styles';

interface Props {
  name: string;
  children: ReactNode | string | number;
}

export const CollectibleInfoItem: FC<Props> = ({ name, children }) => {
  const styles = useCollectibleInfoItemStyles();

  const textChildrenTypes = ['string', 'number'];
  const isText = textChildrenTypes.includes(typeof children);

  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{name}</Text>

      <View>{isText ? <Text style={styles.valueText}>{children}</Text> : children}</View>
    </View>
  );
};
