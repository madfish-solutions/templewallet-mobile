import React, { FC, ReactNode } from 'react';
import { Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { AttentionMessage } from '../attention-message/attention-message';
import { useDisclaimerStyles } from './disclaimer.styles';

interface Props {
  texts: Array<string>;
  children?: ReactNode;
  title?: string;
}

export const Disclaimer: FC<Props> = ({ title, texts, children }) => {
  const styles = useDisclaimerStyles();

  return (
    <AttentionMessage title={title}>
      {isDefined(children)
        ? children
        : texts.map(text => (
            <Text key={text} style={styles.description}>
              {text}
            </Text>
          ))}
    </AttentionMessage>
  );
};
