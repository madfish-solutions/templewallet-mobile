import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking';

import { useSocialButtonStyles } from './social-button.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  url: string;
}

export const SocialButton: FC<Props> = ({ iconName, url, testID }) => {
  const styles = useSocialButtonStyles();

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity}
      style={styles.container}
      onPress={() => openUrl(url)}
      testID={testID}
    >
      <Icon name={iconName} size={formatSize(24)} />
    </TouchableWithAnalytics>
  );
};
