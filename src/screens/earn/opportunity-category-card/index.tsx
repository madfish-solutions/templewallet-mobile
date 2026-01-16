import BigNumber from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { OptionalFormattedAmount } from 'src/components/optional-formatted-amount';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { formatOptionalPercentage } from 'src/utils/earn-opportunities/format.utils';

import { useOpportunityCategoryCardStyles } from './styles';

interface OpportunityCategoryCardProps extends TestIdProps {
  title: string;
  description: string;
  screen: ScreensEnum.Farming | ScreensEnum.Savings;
  depositAmountInFiat?: BigNumber;
  iconName: IconNameEnum;
  netApr?: BigNumber;
  maxApr?: BigNumber;
}

export const OpportunityCategoryCard = memo<OpportunityCategoryCardProps>(
  ({ title, description, screen, depositAmountInFiat, iconName, netApr, maxApr }) => {
    const { navigate } = useNavigation();
    const styles = useOpportunityCategoryCardStyles();

    const handlePress = useCallback(() => navigate(screen), [navigate, screen]);
    const netAprFormatted = useMemo(() => formatOptionalPercentage(netApr), [netApr]);
    const maxAprFormatted = useMemo(() => formatOptionalPercentage(maxApr), [maxApr]);

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
          {depositAmountInFiat?.isZero() ?? false ? (
            <Text style={styles.description}>{description}</Text>
          ) : (
            <View style={styles.leftStatsItem}>
              <Text style={styles.statsItemLabel}>Current deposit amount:</Text>
              <Divider size={formatSize(2)} />
              <OptionalFormattedAmount
                hideApproximateSign
                isDollarValue
                amount={depositAmountInFiat}
                style={styles.statsItemValue}
              />
            </View>
          )}
          <View style={styles.rightStatsItem}>
            <Text style={styles.statsItemLabel}>{depositAmountInFiat?.eq(0) ?? false ? 'Max APR:' : 'Net APR:'}</Text>
            <Text style={styles.statsItemValue}>
              {depositAmountInFiat?.eq(0) ?? false ? maxAprFormatted : netAprFormatted}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);
