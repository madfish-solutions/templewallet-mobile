import React, { FC, ReactNode } from 'react';
import { Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { AttentionMessage } from '../attention-message/attention-message';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useDisclaimerStyles } from './disclaimer.styles';

interface Props {
  texts?: Array<string>;
  children?: ReactNode;
  title?: string;
  iconName?: IconNameEnum;
}

export const Disclaimer: FC<Props> = ({ title, texts, children, iconName }) => {
  const styles = useDisclaimerStyles();

  return (
    <AttentionMessage title={title} iconName={iconName}>
      {isDefined(children)
        ? children
        : texts?.map(text => (
            <Text key={text} style={styles.description}>
              {text}
            </Text>
          ))}
    </AttentionMessage>
  );
};
