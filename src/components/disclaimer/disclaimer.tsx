import React, { FC, ReactNode } from 'react';
import { Text } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { AttentionMessage, AttentionMessageV2 } from '../attention-message/attention-message';
import { IconNameEnum } from '../icon/icon-name.enum';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum.ts';

import { useDisclaimerStyles } from './disclaimer.styles';

interface DisclaimerProps<IconName extends string> {
  texts?: Array<string>;
  children?: ReactNode;
  title?: string;
  iconName?: IconName;
}

interface AttentionMessageProps<IconName extends string> {
  title?: string;
  iconName?: IconName;
}

const DisclaimerHOC = <IconName extends string>(
  AttentionMessageComponent: FCWithChildren<AttentionMessageProps<IconName>>
): FC<DisclaimerProps<IconName>> => {
  const Disclaimer: FC<DisclaimerProps<IconName>> = ({ title, texts, children, iconName }) => {
    const styles = useDisclaimerStyles();

    return (
      <AttentionMessageComponent title={title} iconName={iconName}>
        {isDefined(children)
          ? children
          : texts?.map(text => (
              <Text key={text} style={styles.description}>
                {text}
              </Text>
            ))}
      </AttentionMessageComponent>
    );
  };

  return Disclaimer;
};

/** @deprecated Use DisclaimerV2 instead. */
export const Disclaimer = DisclaimerHOC<IconNameEnum>(AttentionMessage);

export const DisclaimerV2 = DisclaimerHOC<IconNameV2Enum>(AttentionMessageV2);
