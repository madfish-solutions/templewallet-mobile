import { RouteProp, useRoute } from '@react-navigation/native';
import { noop } from 'lodash-es';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { PoolType } from 'src/apis/quipuswap/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadSingleFarmActions, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import { useFarmSelector, useFarmsLoadingSelector, useStakeSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from './selectors';
import { StakeForm } from './stake-form';
import { useStakeFormik } from './stake-form/use-stake-formik';
import { useManageFarmingPoolModalStyles } from './styles';

export const ManageFarmingPoolModal: FC = () => {
  const params = useRoute<RouteProp<ModalsParamList, ModalsEnum.ManageFarmingPool>>().params;
  const styles = useManageFarmingPoolModalStyles();
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef<number | undefined>(-1);
  const dispatch = useDispatch();

  const farm = useFarmSelector(params.id, params.version);
  const farmIsLoading = useFarmsLoadingSelector();
  const farmLevel = farm?.blockInfo.level;
  const stake = useStakeSelector(farm?.item.contractAddress ?? '');

  const pageIsLoading = farmIsLoading && !isDefined(farm);

  const stakeFormik = useStakeFormik(params.id, params.version);
  const { errors: formErrors, submitForm, isSubmitting } = stakeFormik;

  useEffect(() => {
    if (prevBlockLevelRef.current === blockLevel || (isDefined(farmLevel) && farmLevel === blockLevel)) {
      return;
    }

    dispatch(loadSingleFarmActions.submit(params));
    prevBlockLevelRef.current = blockLevel;
  }, [blockLevel, farmLevel, dispatch, params]);

  useEffect(() => {
    if (isDefined(farm)) {
      dispatch(loadSingleFarmStakeActions.submit(farm.item));
    }
  }, [farm]);

  usePageAnalytic(ModalsEnum.ManageFarmingPool);

  const disabledTabSwitcherIndices = useMemo(() => (isDefined(stake) ? [] : [1]), [stake]);

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer isFullScreenMode>
        <TextSegmentControl
          disabledValuesIndices={disabledTabSwitcherIndices}
          selectedIndex={0}
          values={['Deposit', 'Withdraw']}
          onChange={noop}
          testID={ManageFarmingPoolModalSelectors.tabSwitch}
        />
        {pageIsLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={formatSize(32)} />
          </View>
        )}
        {!pageIsLoading && farm?.item.type === PoolType.STABLESWAP && <StakeForm farm={farm} formik={stakeFormik} />}
        {isDefined(farm) && farm.item.type !== PoolType.STABLESWAP && (
          <Text style={styles.notSupportedText}>Non-stableswap farms are not supported yet</Text>
        )}
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargePrimary
          title="Deposit"
          disabled={
            pageIsLoading ||
            farm?.item.type !== PoolType.STABLESWAP ||
            Object.keys(formErrors).length > 0 ||
            isSubmitting
          }
          onPress={submitForm}
          testID={ManageFarmingPoolModalSelectors.depositButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
