import { isString } from 'lodash-es';
import React, { FC, ReactNode } from 'react';
import { Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { AttentionMessage } from '../attention-message/attention-message';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useDisclaimerStyles } from './disclaimer.styles';

interface Props {
  texts?: Array<string | ReactNode>;
  children?: ReactNode;
  title?: string;
  boldText?: string;
  iconName?: IconNameEnum;
}

export const Disclaimer: FC<Props> = ({ title, texts, children, iconName }) => {
  const styles = useDisclaimerStyles();

  return (
    <AttentionMessage title={title} iconName={iconName}>
      {isDefined(children)
        ? children
        : texts?.map((text, index) => (
            <Text key={isString(text) ? text : index} style={styles.description}>
              {text}
            </Text>
          ))}
    </AttentionMessage>
  );
};
