import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { WhiteContainer } from '../../components/white-container/white-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { loadExolixCurrenciesAction } from '../../store/exolix/exolix-actions';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { useBuyStyles } from './buy.styles';
import { useSignedMoonPayUrl } from './useSignedUrl';

export const CryptoTopup = () => {
  const dispatch = useDispatch();
  const styles = useBuyStyles();
  const url = useSignedMoonPayUrl();
  const colors = useColors();
  const { navigate } = useNavigation();

  const handleOnPress = () => {
    dispatch(loadExolixCurrenciesAction.submit());
    navigate(ScreensEnum.Exolix);
  };

  return (
    <>
      <Divider size={formatSize(16)} />
      <WhiteContainer>
        <View style={styles.providerLogo}>
          <Icon name={IconNameEnum.Exolix} width={formatSize(160)} height={formatSize(40)} color={colors.black} />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.textContainer} onPress={handleOnPress} disabled={!url}>
          <Text style={styles.actionsContainer}>Buy TEZ with Exolix</Text>
        </TouchableOpacity>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
    </>
  );
};
