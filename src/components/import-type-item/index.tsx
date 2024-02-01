import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';

import { useImportTypeItemStyles } from './styles';

export interface ImportTypeItemProps {
  title: string;
  description: string;
  iconName: IconNameEnum;
  onPress: EmptyFn;
}

export const ImportTypeItem = memo<ImportTypeItemProps>(({ title, description, iconName, onPress }) => {
  const styles = useImportTypeItemStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={formatSize(32)} />
      </View>
      <Divider size={formatSize(12)} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Divider size={4} />
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
});
