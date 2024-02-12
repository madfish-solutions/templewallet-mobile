import { useNetInfo } from '@react-native-community/netinfo';
import { isNull } from 'lodash-es';
import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useInternetConnectionStatusStyles } from './styles';

interface Props {
  sideBar?: boolean;
}

export const InternetConnectionStatus = memo<Props>(({ sideBar }) => {
  const { isConnected } = useNetInfo();
  const styles = useInternetConnectionStatusStyles();
  const colors = useColors();

  if (isNull(isConnected)) {
    return null;
  }

  return isConnected ? null : (
    <>
      {sideBar && <Divider size={formatSize(16)} />}
      <View style={styles.container}>
        <Icon name={IconNameEnum.NoConnection} size={formatSize(16)} color={colors.black} />
        <Divider size={formatSize(8)} />
        <Text style={styles.text}>No connection</Text>
      </View>
    </>
  );
});
