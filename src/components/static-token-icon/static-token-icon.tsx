import React, { FC, useMemo, useState } from 'react';
import { StyleProp, View } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import { formatSizeScaled } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { StaticTokenIconStyles } from './static-token-icon.styles';

interface Props {
  uri: string;
  size?: number;
}

export const StaticTokenIcon: FC<Props> = ({ uri, size = formatSizeScaled(32) }) => {
  const [isFailed, setIsFailed] = useState(false);

  const style = useMemo<StyleProp<ImageStyle>>(
    () => ({ width: size, height: size, display: isFailed ? 'none' : 'flex' }),
    [size, isFailed]
  );

  return (
    <View style={[StaticTokenIconStyles.container, { borderRadius: size / 2 }]}>
      <FastImage style={style} source={{ uri }} onLoad={() => setIsFailed(false)} onError={() => setIsFailed(true)} />
      {isFailed && <Icon name={IconNameEnum.NoNameToken} size={size} />}
    </View>
  );
};
