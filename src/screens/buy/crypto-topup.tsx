import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { WhiteContainer } from '../../components/white-container/white-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { useBuyStyles } from './buy.styles';
import { useSignedMoonPayUrl } from './useSignedUrl';

export const CryptoTopup = () => {
  const styles = useBuyStyles();
  const url = useSignedMoonPayUrl();
  const colors = useColors();
  const { navigate } = useNavigation();

  return (
    <>
      <Divider size={formatSize(16)} />
      <WhiteContainer>
        <View style={styles.providerLogo}>
          <Icon name={IconNameEnum.Exolix} width={formatSize(160)} height={formatSize(40)} color={colors.black} />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.textContainer} onPress={() => navigate(ScreensEnum.Exolix)} disabled={!url}>
          <Text style={styles.actionsContainer}>Buy TEZ with Exolix</Text>
        </TouchableOpacity>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
    </>
  );
};
