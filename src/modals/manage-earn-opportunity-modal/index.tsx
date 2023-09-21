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
import { earnOpportunitiesTypesToDisplay } from 'src/config/earn-opportunities';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadAllFarmsActions, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import { useFarmSelector, useFarmsLoadingSelector, useFarmStakeSelector } from 'src/store/farms/selectors';
import { loadSingleSavingStakeActions } from 'src/store/savings/actions';
import {
  useSavingsItemSelector,
  useSavingsItemsLoadingSelector,
  useSavingsItemStakeSelector
} from 'src/store/savings/selectors';
import { loadSwapTokensAction } from 'src/store/swap/swap-actions';
import { useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isFarm } from 'src/utils/earn.utils';
import { hasError } from 'src/utils/has-error';
import { isDefined } from 'src/utils/is-defined';

import { ManageEarnOpportunityModalSelectors } from './selectors';
import { StakeForm } from './stake-form';
import { StakeFormValues, useStakeFormik } from './stake-form/use-stake-formik';
import { useEarnOpportunityModalStyles } from './styles';
import { WithdrawForm } from './withdraw-form';
import { useWithdrawFormik } from './withdraw-form/use-withdraw-formik';

const stakeFormFields: Array<keyof StakeFormValues> = ['assetAmount', 'acceptRisks'];
const tabs = ['Deposit', 'Withdraw'];
const tabAnalyticsPropertiesFn = (tabName: string) => ({ tabName });

export const ManageEarnOpportunityModal: FC = () => {
  const route = useRoute<RouteProp<ModalsParamList, ModalsEnum.ManageFarmingPool | ModalsEnum.ManageSavingsPool>>();
  const { id, contractAddress } = route.params;
  const isFarmingPool = route.name === ModalsEnum.ManageFarmingPool;
  const farm = useFarmSelector(id, contractAddress);
  const savingsItem = useSavingsItemSelector(id, contractAddress);
  const earnOpportunityItem = isFarmingPool ? farm?.item : savingsItem;
  const farmIsLoading = useFarmsLoadingSelector();
  const savingsItemIsLoading = useSavingsItemsLoadingSelector();
  const earnOpportunityLoading = isFarmingPool ? farmIsLoading : savingsItemIsLoading;
  const { isLoading: swapTokensMetadataLoading } = useSwapTokensMetadataSelector();
  const pageIsLoading = (earnOpportunityLoading && !isDefined(earnOpportunityItem)) || swapTokensMetadataLoading;
  const farmStake = useFarmStakeSelector(contractAddress);
  const savingsStake = useSavingsItemStakeSelector(contractAddress);
  const stake = isFarmingPool ? farmStake : savingsStake;
  const earnOpportunityIsSupported = earnOpportunitiesTypesToDisplay.includes(
    earnOpportunityItem?.type ?? EarnOpportunityTypeEnum.DEX_TWO
  );

  const styles = useEarnOpportunityModalStyles();
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef(blockLevel);
  const startedLoadingTokensRef = useRef(false);
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const acceptRisksRef = useRef<View>(null);

  const stakeFormik = useStakeFormik(earnOpportunityItem, stake);
  const {
    errors: stakeFormErrors,
    submitForm: submitStakeForm,
    isSubmitting: stakeFormSubmitting,
    getFieldMeta: getStakeFieldMeta
  } = stakeFormik;
  const stakeFormErrorsVisible = stakeFormFields.some(fieldName => hasError(getStakeFieldMeta(fieldName)));
  const { formik: withdrawFormik, isSubmitting: withdrawFormSubmitting } = useWithdrawFormik(
    earnOpportunityItem,
    stake
  );
  const { errors: withdrawFormErrors, submitForm: submitWithdrawForm } = withdrawFormik;

  useEffect(() => {
    if (!isDefined(earnOpportunityItem) || prevBlockLevelRef.current !== blockLevel) {
      prevBlockLevelRef.current = blockLevel;
      dispatch(loadAllFarmsActions.submit());
    }
  }, [blockLevel, earnOpportunityItem, dispatch]);

  useEffect(() => {
    if (!isDefined(earnOpportunityItem)) {
      return;
    }

    dispatch(
      isFarm(earnOpportunityItem)
        ? loadSingleFarmStakeActions.submit(earnOpportunityItem)
        : loadSingleSavingStakeActions.submit(earnOpportunityItem)
    );

    if (!isFarm(earnOpportunityItem) && !startedLoadingTokensRef.current) {
      dispatch(loadSwapTokensAction.submit());
      startedLoadingTokensRef.current = true;
    }
  }, [earnOpportunityItem, dispatch]);

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

  usePageAnalytic(route.name, undefined, route.params);

  const amountToWithdraw = isDefined(stake.fullReward) && +stake.fullReward > 0;
  const disabledTabSwitcherIndices = useMemo(
    () => (isDefined(stake?.lastStakeId) && amountToWithdraw ? [] : [1]),
    [stake, amountToWithdraw]
  );

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer isFullScreenMode scrollViewRef={scrollViewRef}>
        <TextSegmentControl
          disabledValuesIndices={disabledTabSwitcherIndices}
          selectedIndex={tabIndex}
          values={tabs}
          onChange={setTabIndex}
          optionAnalyticsPropertiesFn={tabAnalyticsPropertiesFn}
          testID={ManageEarnOpportunityModalSelectors.tabSwitch}
        />
        {pageIsLoading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={formatSize(32)} />
          </View>
        )}
        {!pageIsLoading && <Divider size={formatSize(16)} />}
        {!pageIsLoading && isDefined(earnOpportunityItem) && earnOpportunityIsSupported && (
          <View style={styles.content}>
            {tabIndex === 0 ? (
              <StakeForm
                acceptRisksRef={acceptRisksRef}
                earnOpportunityItem={earnOpportunityItem}
                formik={stakeFormik}
                stake={stake}
              />
            ) : (
              <WithdrawForm earnOpportunityItem={earnOpportunityItem} formik={withdrawFormik} stake={stake} />
            )}
          </View>
        )}
        {!pageIsLoading && isDefined(earnOpportunityItem) && !earnOpportunityIsSupported && (
          <View style={styles.content}>
            <Text style={styles.notSupportedText}>
              This {isFarmingPool ? 'farming pool' : 'savings pool'} is not supported yet
            </Text>
          </View>
        )}
      </ScreenContainer>
      <ModalButtonsContainer>
        {tabIndex === 0 ? (
          <ButtonLargePrimary
            title="Deposit"
            disabled={pageIsLoading || !earnOpportunityIsSupported || stakeFormErrorsVisible || stakeFormSubmitting}
            onPress={handleDepositClick}
            testID={ManageEarnOpportunityModalSelectors.depositButton}
          />
        ) : (
          <ButtonLargePrimary
            title="Withdraw & Claim rewards"
            disabled={
              pageIsLoading ||
              !earnOpportunityIsSupported ||
              Object.keys(withdrawFormErrors).length > 0 ||
              withdrawFormSubmitting
            }
            onPress={submitWithdrawForm}
            testID={ManageEarnOpportunityModalSelectors.withdrawButton}
          />
        )}
      </ModalButtonsContainer>
    </>
  );
};
