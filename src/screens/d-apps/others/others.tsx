import React, { FC, useState } from 'react';
import { ListRenderItemInfo, StyleProp, Text, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { openUrl } from 'src/utils/linking.util';
import { getTruncatedProps } from 'src/utils/style.util';

import { useOthersDAppStyles } from './others.styles';

interface Props extends TestIdProps {
  item: ListRenderItemInfo<CustomDAppInfo>;
  elementWidth: number;
  style?: StyleProp<ViewStyle>;
}

export const OthersDApp: FC<Props> = ({ item, elementWidth, style, testID }) => {
  const { name, logo, slug, dappUrl } = item.item;
  const styles = useOthersDAppStyles();
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <TouchableWithAnalytics
      testID={testID}
      testIDProperties={{ dapp: slug }}
      onPress={() => openUrl(dappUrl)}
      style={[styles.root, style, { width: elementWidth }]}
    >
      {imageLoadError ? (
        <Icon name={IconNameEnum.NoNameToken} size={formatSize(24)} style={styles.logo} />
      ) : (
        <FastImage style={styles.logo} source={{ uri: logo }} onError={() => setImageLoadError(true)} />
      )}
      <Divider size={formatSize(8)} />
      <Text {...getTruncatedProps(styles.text)}>{name}</Text>
    </TouchableWithAnalytics>
  );
};
