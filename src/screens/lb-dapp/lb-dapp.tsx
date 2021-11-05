import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ButtonMedium } from '../../components/button/button-medium/button-medium';

import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { LpTokenIcon } from '../../components/icon/lp-token-icon/lp-token-icon';
import { TouchableIcon } from '../../components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { formatSize } from '../../styles/format-size';
import { useLbDappStyles } from './lb-dapp.styles';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';

export const LbDapp = () => {
  const styles = useLbDappStyles();

  const onRefreshPressHandler = () => {
    console.log('refresh pressed');
  };

  const onRemoveLiquidityHandler = () => {
    console.log('remove liquidity');
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
      <ButtonLargePrimary title={'test'} iconName={IconNameEnum.MinusIcon} onPress={onRemoveLiquidityHandler} />
    </ScreenContainer>
  );
};
