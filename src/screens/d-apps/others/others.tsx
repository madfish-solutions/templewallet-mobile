import React, { FC } from 'react';
import { Image, ListRenderItemInfo, Text, TouchableOpacity } from 'react-native';

import { Divider } from '../../../components/divider/divider';
import { CustomDAppInfo } from '../../../interfaces/dapps.interface';
import { formatSize } from '../../../styles/format-size';
import { openUrl } from '../../../utils/linking.util';
import { useIntegratedDAppStyles } from './others.styles';

interface Props {
  item: ListRenderItemInfo<CustomDAppInfo>;
}

export const OthersDApp: FC<Props> = ({ item }) => {
  const styles = useIntegratedDAppStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => openUrl(item.item.website)}>
      <Image style={styles.logo} source={{ uri: item.item.logo }} />
      <Divider size={formatSize(8)} />
      <Text style={styles.title}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};
