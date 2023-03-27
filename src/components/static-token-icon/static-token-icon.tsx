import React, { FC, useMemo, useState } from 'react';
import { StyleProp, View } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';

import { MOONPAY_ASSETS_BASIC_URL } from 'src/utils/moonpay.utils';

import { formatSizeScaled } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useStaticTokenIconStyles } from './static-token-icon.styles';

interface Props {
  uri?: string;
  size?: number;
}

const flagWidth = 21;
const flagHeight = 15;

export const StaticTokenIcon: FC<Props> = ({ uri = '', size = formatSizeScaled(32) }) => {
  const [isFailed, setIsFailed] = useState(false);
  const styles = useStaticTokenIconStyles();

  const imageStyle = useMemo<StyleProp<ImageStyle>>(
    () => ({ width: size, height: size, display: isFailed ? 'none' : 'flex' }),
    [size, isFailed]
  );
  const isMoonpayIcon = uri.startsWith(MOONPAY_ASSETS_BASIC_URL);
  const flagScaleFactor = Math.sqrt(size ** 2 / (flagWidth ** 2 + flagHeight ** 2));

  return (
    <>
      {uri.endsWith('.svg') ? (
        <View style={[styles.center, { width: size, height: size, borderRadius: size / 2 }]}>
          <SvgUri
            width={isMoonpayIcon ? size : flagWidth * flagScaleFactor}
            height={isMoonpayIcon ? size : flagHeight * flagScaleFactor}
            uri={uri}
          />
        </View>
      ) : (
        <View style={[styles.container, { borderRadius: size / 2 }]}>
          <FastImage
            style={imageStyle}
            source={{ uri }}
            onLoad={() => setIsFailed(false)}
            onError={() => setIsFailed(true)}
          />
        </View>
      )}
      {isFailed && <Icon name={IconNameEnum.NoNameToken} size={size} />}
    </>
  );
};
