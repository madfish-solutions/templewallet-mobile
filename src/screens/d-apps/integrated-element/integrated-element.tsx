import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';

import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { useIntegratedElementStyles } from './integrated-element.styles';

enum IntegratedElementThemeEnum {
  primary = 'primary'
}

interface Props extends TestIdProps {
  screenName: ScreensEnum;
  iconName: IconNameEnum;
  title: string;
  navigateFn: EmptyFn;
  theme?: IntegratedElementThemeEnum;
  description?: string;
}

export const IntegratedElement: FC<Props> = ({
  iconName,
  title,
  description,
  navigateFn,
  theme = IntegratedElementThemeEnum.primary,
  testID
}) => {
  const styles = useIntegratedElementStyles();

  const handleNavigate = () => navigateFn();

  const themeClasses = {
    primary: {
      background: styles.backgroundPrimary,
      iconBackground: styles.iconBackgroundPrimary
    }
  };

  return (
    <TouchableWithAnalytics
      onPress={handleNavigate}
      style={[styles.root, themeClasses[theme].background]}
      testID={testID}
    >
      <View style={[styles.iconWrapper, themeClasses[theme].iconBackground]}>
        <Icon name={iconName} size={formatSize(24)} />
      </View>

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableWithAnalytics>
  );
};
