import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { WhiteContainer } from '../../components/white-container/white-container';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { openUrl } from '../../utils/linking.util';
import { useBuyStyles } from './buy.styles';
import { useSignedMoonPayUrl } from './useSignedUrl';

const CHAINBITS_TOPUP_URL = 'https://buy.chainbits.com/?crypto=FILM';

export const Debit = () => {
  const styles = useBuyStyles();
  const url = useSignedMoonPayUrl();
  const colors = useColors();

  const { isTezosNode } = useNetworkInfo();

  return (
    <>
      <Divider size={formatSize(16)} />
      {isTezosNode && (
        <WhiteContainer>
          <View style={styles.providerLogo}>
            <Icon name={IconNameEnum.MoonPay} width={formatSize(160)} height={formatSize(40)} color={colors.black} />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.textContainer} onPress={() => openUrl(url)} disabled={!url}>
            <Text style={styles.actionsContainer}>Buy TEZ with MoonPay</Text>
          </TouchableOpacity>
        </WhiteContainer>
      )}
      {!isTezosNode && (
        <WhiteContainer>
          <View style={styles.providerLogo}>
            <Image source={require('./assets/ChainBits.png')} style={styles.chainbitsIcon} />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.textContainer} onPress={() => openUrl(CHAINBITS_TOPUP_URL)} disabled={!url}>
            <Text style={styles.actionsContainer}>Buy FILM with ChainBits</Text>
          </TouchableOpacity>
        </WhiteContainer>
      )}
      <Divider size={formatSize(16)} />
    </>
  );
};
