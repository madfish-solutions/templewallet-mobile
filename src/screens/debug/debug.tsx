import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { FC, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { calculateStringSizeInBytes } from 'src/utils/string.utils';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

import { ImportWatchOnlyDebug } from './import-watch-only-debug/import-watch-only-debug';

export const Debug: FC = () => {
  usePageAnalytic(ScreensEnum.Debug);

  const handleThrowErrorButtonsPress = () => {
    throw new Error('Test error from Debug screen');
  };

  const [asyncStorageStats, setAsyncStorageStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const getAsyncStorageStats = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const stats = await AsyncStorage.multiGet(keys);
      const statsObject = stats.reduce(
        (acc, [key, value]) => ({ ...acc, [key]: calculateStringSizeInBytes(value ?? '') }),
        {}
      );
      setAsyncStorageStats(statsObject);
    };

    getAsyncStorageStats();
  }, []);

  return (
    <ScreenContainer>
      <ImportWatchOnlyDebug />
      <Divider size={formatSize(50)} />
      <ButtonMedium title="Throw Test Error" iconName={IconNameEnum.Alert} onPress={handleThrowErrorButtonsPress} />
      <Divider />
      {Object.entries(asyncStorageStats).map(([key, value]) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} key={key}>
          <Text>{key}</Text>
          <Divider size={formatSize(4)} />
          <Text>{value} B</Text>
        </View>
      ))}
    </ScreenContainer>
  );
};
