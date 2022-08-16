import React, { FC, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { formatSizeScaled } from '../../styles/format-size';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { StaticTokenIconStyles } from './static-token-icon.styles';

interface Props {
  uri: string;
  size?: number;
}

export const StaticTokenIcon: FC<Props> = ({ uri, size = formatSizeScaled(32) }) => {
  const style = useMemo(() => [{ width: size, height: size }], [size]);

  const [isFailed, setIsFailed] = useState(false);

  const handleError = useCallback(() => setIsFailed(true), []);

  return (
    <View style={[StaticTokenIconStyles.container, { borderRadius: size / 2 }]}>
      {isFailed ? (
        <Icon name={IconNameEnum.NoNameToken} size={size} />
      ) : (
        <FastImage style={style} source={{ uri }} onError={handleError} />
      )}
    </View>
  );
};
