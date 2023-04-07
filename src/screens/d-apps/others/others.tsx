import React, { FC, useCallback, useState } from 'react';
import { ListRenderItemInfo, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { openUrl } from 'src/utils/linking.util';
import { getTruncatedProps } from 'src/utils/style.util';

import { useOthersDAppStyles } from './others.styles';

interface Props extends TestIdProps {
  item: ListRenderItemInfo<CustomDAppInfo>;
}

export const OthersDApp: FC<Props> = ({ item, testID }) => {
  const { name, logo, slug, dappUrl } = item.item;
  const styles = useOthersDAppStyles();
  const [imageLoadError, setImageLoadError] = useState(false);
  const { trackEvent } = useAnalytics();

  const handlePress = useCallback(() => {
    trackEvent(testID, AnalyticsEventCategory.ButtonPress, { dapp: slug });
    openUrl(dappUrl);
  }, [trackEvent, testID, slug, dappUrl]);

  return (
    <TouchableOpacity style={styles.container} testID={testID} onPress={handlePress}>
      {imageLoadError ? (
        <Icon name={IconNameEnum.NoNameToken} size={formatSize(24)} style={styles.logo} />
      ) : (
        <FastImage style={styles.logo} source={{ uri: logo }} onError={() => setImageLoadError(true)} />
      )}
      <Divider size={formatSize(8)} />
      <Text {...getTruncatedProps(styles.text)}>{name}</Text>
    </TouchableOpacity>
  );
};
