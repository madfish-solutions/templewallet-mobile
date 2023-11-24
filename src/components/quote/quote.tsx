import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { Divider } from '../divider/divider';

import { useQuoteStyles } from './quote.styles';

interface Props {
  quote: string;
  author: string;
}

export const Quote: FC<Props> = ({ quote, author }) => {
  const styles = useQuoteStyles();

  return (
    <View>
      <Text style={styles.text}>
        <Text style={styles.textQuotes}>“</Text>
        {quote}
        <Text style={styles.textQuotes}>”</Text>
      </Text>
      <Divider size={formatSize(8)} />
      <Text style={styles.author}>{author}</Text>
    </View>
  );
};
