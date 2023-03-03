import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { Divider } from '../divider/divider';
import { useDescriptionStyles, useLabelStyles } from './label.styles';

interface Props {
  label?: string;
  description?: string | { text: string; bold?: boolean }[];
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

interface DescriptionProps {
  description: string | { text: string; bold?: boolean }[];
}

const Description: FC<DescriptionProps> = ({ description }) => {
  const styles = useDescriptionStyles();

  if (Array.isArray(description)) {
    return (
      <Text style={styles.description}>
        {description.map((item, index) => (
          <Text key={index} style={item.bold === true ? styles.boldDescriptionPiece : undefined}>
            {item.text}
          </Text>
        ))}
      </Text>
    );
  }

  return <Text style={styles.description}>{description}</Text>;
};
