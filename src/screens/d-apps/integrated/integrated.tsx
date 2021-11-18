import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { useIntegratedDAppStyles } from './integrated.styles';

interface Props {
  screenName: ScreensEnum;
  iconName: IconNameEnum;
  title: string;
  description?: string;
}

export const IntegratedDApp: FC<Props> = ({ screenName, iconName, title, description }) => {
  const { navigate } = useNavigation();
  const styles = useIntegratedDAppStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigate(screenName)}>
      <Icon name={iconName} width={formatSize(46)} height={formatSize(46)} />
      <Divider size={formatSize(16)} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};
