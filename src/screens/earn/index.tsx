import React, { FC, useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsActions } from 'src/store/farms/actions';
import { useAllFarmsSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { FarmItem } from './farm-item/farm-item';
import { MainInfo } from './main-info/main-info';

export const Earn: FC = () => {
  const dispatch = useDispatch();
  usePageAnalytic(ScreensEnum.Earn);
  const farms = useAllFarmsSelector();
  const stakes = useLastStakesSelector();

  useEffect(() => {
    dispatch(loadAllFarmsActions.submit());
  }, []);

  return (
    <ScreenContainer>
      <MainInfo />
      <Divider size={formatSize(8)} />
      <FlatList
        data={farms.data}
        renderItem={farm => <FarmItem farm={farm.item} lastStakeRecord={stakes[farm.item.item.contractAddress]} />}
      />
    </ScreenContainer>
  );
};
