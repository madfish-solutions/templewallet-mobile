import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useErrorDisclaimerMessageStyles } from './error-disclaimer-message.styles';

interface Props {
  title?: string;
}

export const ErrorDisclaimerMessage: FC<Props> = ({ children, title }) => {
  const styles = useErrorDisclaimerMessageStyles();
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.AlertMonochrome} color={colors.white} />
      <Divider size={formatSize(8)} />
      <View style={styles.content}>
        {isDefined(title) && <Text style={styles.title}>{title}</Text>}
        {children}
      </View>
    </View>
  );
};
