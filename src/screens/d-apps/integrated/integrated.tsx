import React, { FC } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { emptyFn, EmptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { setTestID } from 'src/utils/test-id.utils';

import { useIntegratedDAppStyles } from './integrated.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  title: string;
  description: string;
  onPress?: EmptyFn;
  containerStyles?: StyleProp<ViewStyle>;
}

export const IntegratedDApp: FC<Props> = ({
  iconName,
  title,
  description,
  testID,
  testIDProperties,
  onPress = emptyFn,
  containerStyles
}) => {
  const styles = useIntegratedDAppStyles();
  const { trackEvent } = useAnalytics();

  const handlePress = () => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    onPress();
  };

  return (
    <TouchableOpacity style={[styles.container, containerStyles]} onPress={handlePress} {...setTestID(testID)}>
      <Icon name={iconName} width={formatSize(46)} height={formatSize(46)} />
      <Divider size={formatSize(16)} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};
