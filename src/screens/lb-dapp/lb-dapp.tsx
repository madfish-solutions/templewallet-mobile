import { stubArray } from 'lodash-es';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { LpTokenIcon } from '../../components/icon/lp-token-icon/lp-token-icon';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { useLbDappStyles } from './lb-dapp.styles';

export const LbDapp = () => {
  const { navigate } = useNavigation();
  const styles = useLbDappStyles();

  const onRefreshPressHandler = () => {
    console.log('refresh pressed');
  };

  const onRemoveLiquidityHandler = () => {
    navigate(ModalsEnum.RemoveLiquidity);
  };

  const onAddLiquidityHandler = () => {
    console.log('add liquidity');
  };

  return (
    <ScreenContainer>
      <InsetSubstitute type="top" />
      <View style={styles.lineDivider} />
      <Divider size={formatSize(8)} />
      <View style={styles.lbCoinContainer}>
        <LpTokenIcon firstTokenIcon={IconNameEnum.LbTokenIcon} secondTokenIcon={IconNameEnum.LbTokenIcon} />
        <Text style={styles.lbCoinText}>XTZ/tzBTC</Text>
        <Divider size={formatSize(8)} />
        <TouchableIcon name={IconNameEnum.RefreshIcon} size={formatSize(24)} onPress={onRefreshPressHandler} />
      </View>
      <View style={styles.bottomLbContainer}>
        <View>
          <Text style={styles.priceTitle}>price</Text>
          <Text style={styles.priceValue}>$ 188,000,000.00</Text>
        </View>
        <TouchableOpacity style={styles.chartIconWrapper}>
          <Icon name={IconNameEnum.ChartIcon} size={formatSize(16)} />
        </TouchableOpacity>
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.lineDivider} />
      <Divider size={formatSize(16)} />
      <ButtonsContainer>
        <ButtonLargePrimary title={'REMOVE'} iconName={IconNameEnum.MinusIcon} onPress={onRemoveLiquidityHandler} />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary title={'ADD'} iconName={IconNameEnum.PlusIcon} onPress={onAddLiquidityHandler} />
      </ButtonsContainer>
    </ScreenContainer>
  );
};
