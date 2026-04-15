import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { Divider } from '../divider/divider';

import { useQuoteStyles } from './quote.styles';

interface Props {
  quote: string;
  author: string;
}

export const Quote: FC<Props> = ({ quote, author }) => {
  const styles = useQuoteStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>“{quote}”</Text>
      <Divider size={formatSize(12)} />
      <Text style={styles.author}>© {author}</Text>
    </View>
  );
};
