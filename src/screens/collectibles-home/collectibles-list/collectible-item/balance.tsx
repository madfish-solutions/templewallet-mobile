import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';

import { useBalanceStyles } from './styles';

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
