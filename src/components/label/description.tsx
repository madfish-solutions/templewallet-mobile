import React, { FC } from 'react';
import { Text } from 'react-native';

import { useDescriptionStyles } from './styles';

export type DescriptionType = string | { text: string; bold?: boolean }[];

interface DescriptionProps {
  description: DescriptionType;
}

export const Description: FC<DescriptionProps> = ({ description }) => {
  const styles = useDescriptionStyles();

  if (Array.isArray(description)) {
    return (
      <Text style={styles.description}>
        {description.map((item, index) => (
          <Text key={index} style={Boolean(item.bold) ? styles.boldDescriptionPiece : undefined}>
            {item.text}
          </Text>
        ))}
      </Text>
    );
  }

  return <Text style={styles.description}>{description}</Text>;
};
