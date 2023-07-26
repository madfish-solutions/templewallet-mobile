import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { Icon } from '../icon';
import { IconNameEnum } from '../icon-name.enum';
import { useExternalLinkButtonStyles } from './external-link-button.styles';

interface Props extends TestIdProps {
  url: string;
}

export const ExternalLinkButton: FC<Props> = ({ url, testID }) => {
  const colors = useColors();
  const styles = useExternalLinkButtonStyles();

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity}
      style={styles.container}
      testID={testID}
      onPress={() => openUrl(url)}
    >
      <Icon name={IconNameEnum.ExternalLink} color={colors.blue} />
    </TouchableWithAnalytics>
  );
};
