import React, { FC, useCallback, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TruncatedText } from 'src/components/truncated-text';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useOpenUrlInAppBrowser } from 'src/utils/linking';

import { useOthersDAppStyles } from './others.styles';

interface Props extends TestIdProps {
  item: CustomDAppInfo;
  itemWidth?: number;
}

export const OthersDApp: FC<Props> = ({ item, itemWidth, testID }) => {
  const { name, logo, slug, dappUrl } = item;
  const [imageLoadError, setImageLoadError] = useState(false);

  const styles = useOthersDAppStyles();
  const openUrl = useOpenUrlInAppBrowser();

  const onPress = useCallback(() => openUrl(dappUrl), [openUrl, dappUrl]);

  return (
    <TouchableWithAnalytics
      style={{
        width: itemWidth,
        padding: formatSize(8)
      }}
      testID={testID}
      testIDProperties={{ dapp: slug }}
      onPress={onPress}
    >
      <View style={styles.container}>
        {imageLoadError ? (
          <Icon name={IconNameEnum.NoNameToken} size={formatSize(24)} style={styles.logo} />
        ) : (
          <FastImage style={styles.logo} source={{ uri: logo }} onError={() => setImageLoadError(true)} />
        )}
        <Divider size={formatSize(8)} />
        <TruncatedText style={styles.text}>{name}</TruncatedText>
      </View>
    </TouchableWithAnalytics>
  );
};
