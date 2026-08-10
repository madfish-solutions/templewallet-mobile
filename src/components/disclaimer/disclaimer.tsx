import React, { FC, ReactNode } from 'react';
import { Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { AttentionMessage } from '../attention-message/attention-message';
import { IconNameEnum } from '../icon/icon-name.enum';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum.ts';

import { useDisclaimerStyles } from './disclaimer.styles';

interface Props {
  texts?: Array<string>;
  children?: ReactNode;
  title?: string;
  iconName?: IconNameEnum;
  iconNameV2?: IconNameV2Enum;
}

export const Disclaimer: FC<Props> = ({ title, texts, children, iconName, iconNameV2 }) => {
  const styles = useDisclaimerStyles();

  return (
    <AttentionMessage title={title} iconName={iconName} iconNameV2={iconNameV2}>
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
