import React, { FC } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { emptyFn, EmptyFn } from 'src/config/general';
import { formatSize } from 'src/styles/format-size';

import { useIntegratedDAppStyles } from './integrated.styles';

interface Props {
  iconName: IconNameEnum;
  title: string;
  description: string;
  onPress?: EmptyFn;
  containerStyles?: StyleProp<ViewStyle>;
}

export const IntegratedDApp: FC<Props> = ({ iconName, title, description, onPress = emptyFn, containerStyles }) => {
  const styles = useIntegratedDAppStyles();

  return (
    <TouchableOpacity style={[styles.container, containerStyles]} onPress={onPress}>
      <Icon name={iconName} width={formatSize(46)} height={formatSize(46)} />
      <Divider size={formatSize(16)} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};
