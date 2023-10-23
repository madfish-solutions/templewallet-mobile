import React, { FC } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { EmptyFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';

import { useIntegratedElementStyles } from './integrated-element.styles';

interface Props extends TestIdProps {
  iconName: IconNameEnum;
  title: string;
  navigateFn: EmptyFn;
  description?: string;
  backgroundColorStyle?: StyleProp<ViewStyle>;
  iconBackgroundColorStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

export const IntegratedElement: FC<Props> = ({
  iconName,
  title,
  description,
  navigateFn,
  backgroundColorStyle,
  iconBackgroundColorStyle,
  style,
  testID
}) => {
  const styles = useIntegratedElementStyles();

  return (
    <TouchableWithAnalytics onPress={navigateFn} style={[styles.root, backgroundColorStyle, style]} testID={testID}>
      <View style={[styles.iconWrapper, iconBackgroundColorStyle]}>
        <Icon name={iconName} size={formatSize(24)} />
      </View>

      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableWithAnalytics>
  );
};
