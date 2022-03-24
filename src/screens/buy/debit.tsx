import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { WhiteContainer } from '../../components/white-container/white-container';
import { formatSize } from '../../styles/format-size';
import { openUrl } from '../../utils/linking.util';
import { useBuyStyles } from './buy.styles';
import { useSignedMoonPayUrl } from './useSignedUrl';

export const Debit = () => {
  const styles = useBuyStyles();
  const url = useSignedMoonPayUrl();

  return (
    <>
      <Divider size={formatSize(16)} />
      <WhiteContainer>
        <View style={styles.providerLogo}>
          <Icon name={IconNameEnum.MoonPay} size={formatSize(160)} />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.textContainer} onPress={() => openUrl(url)} disabled={!url}>
          <Text style={styles.actionsContainer}>Buy TEZ with MoonPay</Text>
        </TouchableOpacity>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
      {/* <WhiteContainer>
        <View style={styles.providerLogo}>
          <Icon name={IconNameEnum.Ramp} size={formatSize(160)} />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.textContainer} onPress={emptyFn}>
          <Text style={styles.actionsContainer}>Buy TEZ with Ramp</Text>
        </TouchableOpacity>
      </WhiteContainer> */}
    </>
  );
};
