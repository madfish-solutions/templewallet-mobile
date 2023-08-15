import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../../styles/format-size';
import { Icon } from '../../../icon/icon';
import { IconNameEnum } from '../../../icon/icon-name.enum';
import { useBalanceStyles } from './balance.styles';

interface Props {
  balance: string;
}

export const Balance: FC<Props> = ({ balance }) => {
  const styles = useBalanceStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.text}>{balance}</Text>

      <Icon name={IconNameEnum.Action} size={formatSize(8)} />
    </View>
  );
};
