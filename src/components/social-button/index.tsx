import React, { FC, useCallback } from 'react';

import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { openUrl } from 'src/utils/linking';

import { SocialIconNameEnum } from './social-icon-name-enum';
import { socialIconNameMap } from './social-icon-name.map';
import { useSocialButtonStyles } from './styles';

interface Props extends TestIdProps {
  iconName: SocialIconNameEnum;
  url?: string | nullish;
}

export const SocialButton: FC<Props> = ({ iconName, url, testID }) => {
  const styles = useSocialButtonStyles();
  const colors = useColors();

  const IconComponent = socialIconNameMap[iconName];

  const handlePress = useCallback(() => {
    if (url) {
      openUrl(url);
    }
  }, [url]);

  return (
    <TouchableWithAnalytics
      Component={SafeTouchableOpacity}
      style={styles.container}
      onPress={handlePress}
      testID={testID}
    >
      <IconComponent
        color={url ? colors.orange : colors.disabled}
        width={formatSize(iconName === SocialIconNameEnum.Discord ? 27.5 : 25)}
      />
    </TouchableWithAnalytics>
  );
};
