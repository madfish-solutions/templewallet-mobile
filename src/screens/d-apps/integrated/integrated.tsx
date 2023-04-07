import React, { FC, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { useSirsInfo } from 'src/hooks/use-sirs-info.hook';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { useIntegratedDAppStyles } from './integrated.styles';

interface Props extends TestIdProps {
  screenName: ScreensEnum.LiquidityBakingDapp;
  iconName: IconNameEnum;
  title: string;
  description?: string;
}

export const IntegratedDApp: FC<Props> = ({ screenName, iconName, title, description, testID }) => {
  const { navigate } = useNavigation();
  const { token, isPositiveBalance } = useSirsInfo();
  const { trackEvent } = useAnalytics();

  const styles = useIntegratedDAppStyles();

  const handlePress = useCallback(() => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress);
    navigate(screenName);
  }, [trackEvent, testID, navigate, screenName]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} testID={testID}>
      <Icon name={iconName} width={formatSize(46)} height={formatSize(46)} />
      <Divider size={formatSize(16)} />
      <View>
        <Text style={styles.title}>{title}</Text>
        {isDefined(token) && isPositiveBalance ? (
          <View style={styles.balanceWrapper}>
            <Text style={[styles.balance, styles.descriptionOrange]}>Balance:</Text>
            <AssetValueText asset={token} amount={token.balance} style={styles.descriptionOrange} />
          </View>
        ) : (
          <Text style={styles.descriptionGrey}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
