import { RouteProp, useRoute } from '@react-navigation/native';
import { noop } from 'lodash-es';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, findNodeHandle, ScrollView, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadAllFarmsActions, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import { useFarmSelector, useFarmsLoadingSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { hasError } from 'src/utils/has-error';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from './selectors';
import { StakeForm } from './stake-form';
import { StakeFormValues, useStakeFormik } from './stake-form/use-stake-formik';
import { useManageFarmingPoolModalStyles } from './styles';
import { WithdrawForm } from './withdraw-form';
import { useWithdrawFormik } from './withdraw-form/use-withdraw-formik';

const stakeFormFields: Array<keyof StakeFormValues> = ['assetAmount', 'acceptRisks'];

export const ManageFarmingPoolModal: FC = () => {
  const params = useRoute<RouteProp<ModalsParamList, ModalsEnum.ManageFarmingPool>>().params;
  const styles = useManageFarmingPoolModalStyles();
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef(blockLevel);
  const dispatch = useDispatch();
  const farm = useFarmSelector(params.id, params.version);
  const farmIsLoading = useFarmsLoadingSelector();
  const stakes = useLastStakesSelector();
  const stake = isDefined(farm) ? stakes[farm.item.contractAddress] : undefined;
  const pageIsLoading = farmIsLoading && !isDefined(farm);
  const [tabIndex, setTabIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const acceptRisksRef = useRef<View>(null);

  const stakeFormik = useStakeFormik(params.id, params.version);
  const {
    errors: stakeFormErrors,
    submitForm: submitStakeForm,
    isSubmitting: stakeFormSubmitting,
    getFieldMeta: getStakeFieldMeta
  } = stakeFormik;
  const stakeFormErrorsVisible = stakeFormFields.some(fieldName => hasError(getStakeFieldMeta(fieldName)));
  const withdrawFormik = useWithdrawFormik(params.id, params.version);
  const {
    errors: withdrawFormErrors,
    submitForm: submitWithdrawForm,
    isSubmitting: withdrawFormSubmitting
  } = withdrawFormik;

  useEffect(() => {
    if (!isDefined(farm) || prevBlockLevelRef.current !== blockLevel) {
      prevBlockLevelRef.current = blockLevel;
      dispatch(loadAllFarmsActions.submit());
    }
  }, [blockLevel, farm, dispatch]);

  useEffect(() => {
    if (isDefined(farm)) {
      dispatch(loadSingleFarmStakeActions.submit(farm.item));
    }
  }, [farm]);

  const handleDepositClick = useCallback(() => {
    const scrollViewHandle = findNodeHandle(scrollViewRef.current);
    if (
      isDefined(stakeFormErrors.acceptRisks) &&
      !isDefined(stakeFormErrors.assetAmount) &&
      isDefined(acceptRisksRef.current) &&
      isDefined(scrollViewHandle)
    ) {
      acceptRisksRef.current.measureLayout(
        scrollViewHandle,
        (_, y) => scrollViewRef.current?.scrollTo({ y, animated: true }),
        noop
      );
    }
    submitStakeForm();
  }, [submitStakeForm, stakeFormErrors]);

  usePageAnalytic(ModalsEnum.ManageFarmingPool);

  const disabledTabSwitcherIndices = useMemo(() => (isDefined(stake?.lastStakeId) ? [] : [1]), [stake]);

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer isFullScreenMode scrollViewRef={scrollViewRef}>
        <TextSegmentControl
          disabledValuesIndices={disabledTabSwitcherIndices}
          selectedIndex={tabIndex}
          values={['Deposit', 'Withdraw']}
          onChange={setTabIndex}
          testID={ManageFarmingPoolModalSelectors.tabSwitch}
        />
        {pageIsLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={formatSize(32)} />
          </View>
        )}
        {!pageIsLoading && <Divider size={formatSize(16)} />}
        {!pageIsLoading && farm?.item.type === EarnOpportunityTypeEnum.STABLESWAP && (
          <View style={styles.content}>
            {tabIndex === 0 ? (
              <StakeForm acceptRisksRef={acceptRisksRef} farm={farm} formik={stakeFormik} stake={stake} />
            ) : (
              <WithdrawForm farm={farm} formik={withdrawFormik} stake={stake} />
            )}
          </View>
        )}
        {!pageIsLoading && isDefined(farm) && farm.item.type !== EarnOpportunityTypeEnum.STABLESWAP && (
          <View style={styles.content}>
            <Text style={styles.notSupportedText}>Non-stableswap farms are not supported yet</Text>
          </View>
        )}
      </ScreenContainer>
      <ModalButtonsContainer>
        {tabIndex === 0 ? (
          <ButtonLargePrimary
            title="Deposit"
            disabled={
              pageIsLoading ||
              farm?.item.type !== EarnOpportunityTypeEnum.STABLESWAP ||
              stakeFormErrorsVisible ||
              stakeFormSubmitting
            }
            onPress={handleDepositClick}
            testID={ManageFarmingPoolModalSelectors.depositButton}
          />
        ) : (
          <ButtonLargePrimary
            title="Withdraw & Claim rewards"
            disabled={
              pageIsLoading ||
              farm?.item.type !== EarnOpportunityTypeEnum.STABLESWAP ||
              Object.keys(withdrawFormErrors).length > 0 ||
              withdrawFormSubmitting
            }
            onPress={submitWithdrawForm}
            testID={ManageFarmingPoolModalSelectors.withdrawButton}
          />
        )}
      </ModalButtonsContainer>
    </>
  );
};
