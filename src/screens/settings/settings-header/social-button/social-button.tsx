import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { openUrl } from 'src/utils/linking.util';

import { useSocialButtonStyles } from './social-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  url: string;
}

export const SocialButton: FC<Props> = ({ iconName, url, testID }) => {
  const styles = useSocialButtonStyles();
  const { trackEvent } = useAnalytics();

  const handlePress = () => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress);
    openUrl(url);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Icon name={iconName} size={formatSize(24)} />
    </TouchableOpacity>
  );
};
