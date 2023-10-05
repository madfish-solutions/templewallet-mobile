import { RouteProp, useRoute } from '@react-navigation/native';
import { BigNumber } from 'bignumber.js';
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
import { ZERO } from 'src/utils/number.util';
import { percentageToFraction } from 'src/utils/percentage.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { PERCENTAGE_OPTIONS } from './constants';
import { ManageEarnOpportunityModalSelectors } from './selectors';
import { StakeForm } from './stake-form';
import { StakeFormValues, useStakeFormik } from './stake-form/use-stake-formik';
import { useEarnOpportunityModalStyles } from './styles';
import { WithdrawForm } from './withdraw-form';
import { useWithdrawFormik } from './withdraw-form/use-withdraw-formik';

const stakeFormFields: Array<keyof StakeFormValues> = ['assetAmount', 'acceptRisks'];
const tabs = ['Deposit', 'Withdraw'];
const tabAnalyticsPropertiesFn = (tabName: string) => ({ tabName });

const stakeButtonTestIds: Partial<Record<EarnOpportunityTypeEnum, string>> = {
  [EarnOpportunityTypeEnum.KORD_FI_SAVING]: ManageEarnOpportunityModalSelectors.kordFiDepositButton
};

const withdrawButtonTestIds: Partial<Record<EarnOpportunityTypeEnum, string>> = {
  [EarnOpportunityTypeEnum.KORD_FI_SAVING]: ManageEarnOpportunityModalSelectors.kordFiWithdrawButton
};

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
  const earnOpportunityType = earnOpportunityItem?.type ?? EarnOpportunityTypeEnum.DEX_TWO;
  const earnOpportunityIsSupported = earnOpportunitiesTypesToDisplay.includes(earnOpportunityType);

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
    getFieldMeta: getStakeFieldMeta,
    values: stakeFormValues
  } = stakeFormik;
  const stakeFormErrorsPresent = Object.keys(stakeFormErrors).length > 0;
  const stakeFormErrorsVisible = stakeFormFields.some(fieldName => hasError(getStakeFieldMeta(fieldName)));
  const { formik: withdrawFormik, isSubmitting: withdrawFormSubmitting } = useWithdrawFormik(
    earnOpportunityItem,
    stake
  );
  const { errors: withdrawFormErrors, submitForm: submitWithdrawForm, values: withdrawFormValues } = withdrawFormik;
  const withdrawFormErrorsPresent = Object.keys(withdrawFormErrors).length > 0;

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

  const isKordFi = earnOpportunityItem?.type === EarnOpportunityTypeEnum.KORD_FI_SAVING ?? false;
  const amountToWithdraw = isDefined(stake) && isDefined(stake.fullReward) && +stake.fullReward > 0;
  const disabledTabSwitcherIndices = useMemo(() => {
    if (isDefined(stake)) {
      if (isKordFi && amountToWithdraw) {
        return [];
      } else if (!isKordFi && isDefined(stake.lastStakeId)) {
        return [];
      }
    }

    return [1];
  }, [isKordFi, amountToWithdraw, stake]);

  const stakeButtonTestIdProperties = useMemo(() => {
    if (stakeFormErrorsPresent) {
      return;
    }

    const { asset, amount: atomicAmount = ZERO } = stakeFormValues.assetAmount;

    return { name: asset.symbol, value: mutezToTz(atomicAmount, asset.decimals ?? 0).toNumber() };
  }, [stakeFormValues, stakeFormErrorsPresent]);

  const withdrawButtonTestIdProperties = useMemo(() => {
    if (withdrawFormErrorsPresent) {
      return;
    }

    const { tokenOption, amountOptionIndex } = withdrawFormValues;
    const percentage = PERCENTAGE_OPTIONS[amountOptionIndex];
    const atomicAmount = new BigNumber(stake?.depositAmountAtomic ?? 0)
      .times(percentageToFraction(percentage))
      .integerValue(BigNumber.ROUND_DOWN);

    return {
      name: tokenOption.token.symbol,
      value: mutezToTz(atomicAmount, tokenOption.token.decimals ?? 0).toNumber()
    };
  }, [withdrawFormValues, stake?.depositAmountAtomic, withdrawFormErrorsPresent]);

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
            testID={stakeButtonTestIds[earnOpportunityType] ?? ManageEarnOpportunityModalSelectors.depositButton}
            testIDProperties={stakeButtonTestIdProperties}
          />
        ) : (
          <ButtonLargePrimary
            title="Withdraw & Claim rewards"
            disabled={
              pageIsLoading || !earnOpportunityIsSupported || withdrawFormErrorsPresent || withdrawFormSubmitting
            }
            onPress={submitWithdrawForm}
            testID={withdrawButtonTestIds[earnOpportunityType] ?? ManageEarnOpportunityModalSelectors.withdrawButton}
            testIDProperties={withdrawButtonTestIdProperties}
          />
        )}
      </ModalButtonsContainer>
    </>
  );
};
