import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { Divider } from '../divider/divider';

import { DescriptionType, Description } from './description';
import { useLabelStyles } from './styles';

interface Props {
  label?: string;
  description?: DescriptionType;
  isOptional?: boolean;
}

export const Label: FC<Props> = ({ label, description, isOptional = false }) => {
  const styles = useLabelStyles();

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {isDefined(label) && <Text style={styles.label}>{label}</Text>}
        {isOptional && (
          <>
            <Divider size={formatSize(6)} />
            <Text style={styles.isOptionalLabel}>(optional)</Text>
          </>
        )}
      </View>

      {isDefined(description) && <Description description={description} />}
    </View>
  );
};
