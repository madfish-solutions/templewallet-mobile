import React, { FC, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsActions } from 'src/store/farms/actions';
import { useAllFarmsSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useEarnStyles } from './earn.styles';
import { FarmItem } from './farm-item/farm-item';
import { MainInfo } from './main-info/main-info';

export const Earn: FC = () => {
  const dispatch = useDispatch();
  usePageAnalytic(ScreensEnum.Earn);
  const farms = useAllFarmsSelector();
  const stakes = useLastStakesSelector();
  const styles = useEarnStyles();

  useEffect(() => {
    dispatch(loadAllFarmsActions.submit());
  }, []);

  return (
    <>
      <MainInfo />
      <Divider size={formatSize(8)} />
      {farms.isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={farms.data}
          ListEmptyComponent={<DataPlaceholder text="No records found." />}
          renderItem={farm => <FarmItem farm={farm.item} lastStakeRecord={stakes[farm.item.item.contractAddress]} />}
        />
      )}
    </>
  );
};
