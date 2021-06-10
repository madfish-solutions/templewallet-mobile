import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { useLabelStyles } from './label.styles';

interface Props {
  label?: string;
  description?: React.ReactChild | React.ReactChild[];
}

export const Label: FC<Props> = ({ label, description }) => {
  const styles = useLabelStyles();

  return (
    <View style={styles.container}>
      {isDefined(label) && <Text style={styles.label}>{label}</Text>}
      {isDefined(description) &&
        (description && typeof description === 'object' ? (
          description
        ) : (
          <Text style={styles.description}>{description}</Text>
        ))}
    </View>
  );
};
