import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PERCENTAGE_DECIMALS } from 'src/config/earn-opportunities';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';

import { useOpportunityCategoryCardStyles } from './styles';

interface OpportunityCategoryCardProps extends TestIdProps {
  title: string;
  description: string;
  screen: ScreensEnum.Farming | ScreensEnum.Savings;
  depositAmountInFiat: BigNumber;
  iconName: IconNameEnum;
  netApr: BigNumber;
  maxApr: BigNumber;
}

export const OpportunityCategoryCard: FC<OpportunityCategoryCardProps> = ({
  title,
  description,
  screen,
  depositAmountInFiat,
  iconName,
  netApr,
  maxApr
}) => {
  const { navigate } = useNavigation();
  const styles = useOpportunityCategoryCardStyles();

  const handlePress = useCallback(() => navigate(screen), [navigate, screen]);
  const netAprFormatted = useMemo(() => netApr.toFixed(PERCENTAGE_DECIMALS), [netApr]);
  const maxAprFormatted = useMemo(() => maxApr.toFixed(PERCENTAGE_DECIMALS), [maxApr]);

  return (
    <TouchableOpacity style={styles.root} onPress={handlePress}>
      <View style={styles.title}>
        <Icon size={formatSize(16)} name={iconName} />
        <Divider size={formatSize(8)} />
        <Text style={styles.titleText}>{title}</Text>
        <Icon name={IconNameEnum.ChevronRight} size={formatSize(24)} />
      </View>
      <Divider size={formatSize(8)} />
      <HorizontalBorder />
      <Divider size={formatSize(8)} />
      <View style={styles.footer}>
        {depositAmountInFiat.gt(0) ? (
          <View style={styles.leftStatsItem}>
            <Text style={styles.statsItemLabel}>Current deposit amount:</Text>
            <Divider size={formatSize(2)} />
            <FormattedAmount
              hideApproximateSign
              isDollarValue
              amount={depositAmountInFiat}
              style={styles.statsItemValue}
            />
          </View>
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}
        <View style={styles.rightStatsItem}>
          <Text style={styles.statsItemLabel}>{depositAmountInFiat.gt(0) ? 'Net APR:' : 'Max APR:'}</Text>
          <Text style={styles.statsItemValue}>{depositAmountInFiat.gt(0) ? netAprFormatted : maxAprFormatted}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
