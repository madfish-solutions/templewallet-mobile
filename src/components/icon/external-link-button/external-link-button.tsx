import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useCallback } from 'react';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { openUrl } from 'src/utils/linking.util';

import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { useExternalLinkButtonStyles } from './external-link-button.styles';

interface Props extends TestIdProps {
  url: string;
}

export const ExternalLinkButton: FC<Props> = ({ url, testID }) => {
  const colors = useColors();
  const styles = useExternalLinkButtonStyles();
  const { trackEvent } = useAnalytics();

  const handlePress = useCallback(() => {
    openUrl(url);
    trackEvent(testID, AnalyticsEventCategory.ButtonPress);
  }, [trackEvent, testID, url]);

  return (
    <TouchableOpacity style={styles.container} testID={testID} onPress={handlePress}>
      <Icon name={IconNameEnum.ExternalLink} color={colors.blue} />
    </TouchableOpacity>
  );
};
