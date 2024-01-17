import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { ImportType } from 'src/modals/choose-import-type/interfaces';
import { formatSize } from 'src/styles/format-size';

import { useImportTypeItemStyles } from './styles';

export const ImportTypeItem = memo<ImportType>(({ title, description, iconName, onPress }) => {
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
