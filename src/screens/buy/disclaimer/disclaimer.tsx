import React from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { formatSize } from '../../../styles/format-size';
import { useDisclaimerStyles } from './disclaimer.styles';

export const Disclaimer = () => {
  const styles = useDisclaimerStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.Alert} />
      <Divider size={formatSize(8)} />
      <View>
        <Text style={styles.header}>Disclaimer</Text>
        <Text style={styles.body}>
          Temple integrated third-party solutions to buy TEZ with crypto or a Debit/Credit card. Choose a provider,
          follow guides, get TEZ on your account.
        </Text>
      </View>
    </View>
  );
};
