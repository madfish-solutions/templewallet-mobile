import React, { FC } from 'react';
import { GestureResponderEvent, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { TestIdProps } from '../../../interfaces/test-id.props';
import { setTestID } from '../../../utils/test-id.utils';
import { WhiteContainerActionStyles } from './white-container-action.styles';

type Props = Pick<TouchableOpacityProps, 'disabled' | 'onPress'> & TestIdProps;

export const WhiteContainerAction: FC<Props> = ({ disabled, onPress, children, testID, testIDProperties }) => {
  const { trackEvent } = useAnalytics();

  const handlePress = (event: GestureResponderEvent) => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, testIDProperties);
    onPress?.(event);
  };

  return (
    <TouchableOpacity
      style={WhiteContainerActionStyles.container}
      disabled={disabled}
      onPress={handlePress}
      {...setTestID(testID)}
    >
      {children}
    </TouchableOpacity>
  );
};
