import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';

import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { IconV2 } from '../icon-v2';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum.ts';

import { useAttentionMessageStyles } from './attention-message.styles';

interface AttentionMessageProps<IconName extends string> {
  title?: string;
  iconName?: IconName;
}

interface EssentialIconProps<IconName extends string> {
  name: IconName;
}

const AttentionMessageHOC = <IconName extends string>(
  IconComponent: FC<EssentialIconProps<IconName>>,
  defaultIconName: IconName
): FCWithChildren<AttentionMessageProps<IconName>> => {
  const AttentionMessage: FCWithChildren<AttentionMessageProps<IconName>> = ({
    children,
    title,
    iconName = defaultIconName
  }) => {
    const styles = useAttentionMessageStyles();

    return (
      <View style={styles.container}>
        <IconComponent name={iconName} />
        <Divider size={formatSize(8)} />
        <View style={styles.content}>
          {isDefined(title) && <Text style={styles.title}>{title}</Text>}
          {children}
        </View>
      </View>
    );
  };

  return AttentionMessage;
};

/** @deprecated Use AttentionMessageV2 instead. */
export const AttentionMessage = AttentionMessageHOC<IconNameEnum>(Icon, IconNameEnum.Alert);

export const AttentionMessageV2 = AttentionMessageHOC<IconNameV2Enum>(IconV2, IconNameV2Enum.AlarmTriangle);
