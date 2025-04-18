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
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { loadAllFarmsAction, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import { useFarm, useFarmsLoadingSelector, useFarmStakeSelector } from 'src/store/farms/selectors';
import { loadAllSavingsAction, loadSingleSavingStakeActions } from 'src/store/savings/actions';
import {
  useSavingsItem,
  useSavingsItemsLoadingSelector,
  useSavingsItemStakeSelector
} from 'src/store/savings/selectors';
import { loadSwapTokensAction } from 'src/store/swap/swap-actions';
import { useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
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
  [EarnOpportunityTypeEnum.KORD_FI_SAVING]: ManageEarnOpportunityModalSelectors.kordFiDepositButton,
  [EarnOpportunityTypeEnum.YOUVES_SAVING]: ManageEarnOpportunityModalSelectors.youvesSavingsDepositButton
};

const withdrawButtonTestIds: Partial<Record<EarnOpportunityTypeEnum, string>> = {
  [EarnOpportunityTypeEnum.KORD_FI_SAVING]: ManageEarnOpportunityModalSelectors.kordFiWithdrawButton,
  [EarnOpportunityTypeEnum.YOUVES_SAVING]: ManageEarnOpportunityModalSelectors.youvesSavingsWithdrawButton
};

export const ManageEarnOpportunityModal: FC = () => {
  const route = useRoute<RouteProp<ModalsParamList, ModalsEnum.ManageFarmingPool | ModalsEnum.ManageSavingsPool>>();
  const { id, contractAddress } = route.params;
  const isFarmingPool = route.name === ModalsEnum.ManageFarmingPool;
  const farm = useFarm(id, contractAddress);
  const savingsItem = useSavingsItem(id, contractAddress);
  const earnOpportunityItem = isFarmingPool ? farm?.item : savingsItem;
  const farmIsLoading = useFarmsLoadingSelector();
  const savingsItemIsLoading = useSavingsItemsLoadingSelector();
  const earnOpportunityLoading = isFarmingPool ? farmIsLoading : savingsItemIsLoading;
  const { isLoading: swapTokensMetadataLoading } = useSwapTokensMetadataSelector();
  const accountPkh = useCurrentAccountPkhSelector();
  const pageIsLoading = (earnOpportunityLoading && !isDefined(earnOpportunityItem)) || swapTokensMetadataLoading;
  const farmStake = useFarmStakeSelector(contractAddress);
  const savingsStake = useSavingsItemStakeSelector(contractAddress);
  const stake = isFarmingPool ? farmStake : savingsStake;
  const earnOpportunityType = earnOpportunityItem?.type ?? EarnOpportunityTypeEnum.DEX_TWO;
  const earnOpportunityIsSupported = earnOpportunitiesTypesToDisplay.includes(earnOpportunityType);

  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();
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
      dispatch(isFarmingPool ? loadAllFarmsAction() : loadAllSavingsAction());
    }
  }, [blockLevel, earnOpportunityItem, dispatch, isFarmingPool]);

  useEffect(() => {
    if (!isDefined(earnOpportunityItem)) {
      return;
    }

    dispatch(
      isFarm(earnOpportunityItem)
        ? loadSingleFarmStakeActions.submit({ farm: earnOpportunityItem, accountPkh })
        : loadSingleSavingStakeActions.submit({ item: earnOpportunityItem, accountPkh })
    );

    if (!isFarm(earnOpportunityItem) && !startedLoadingTokensRef.current) {
      dispatch(loadSwapTokensAction.submit());
      startedLoadingTokensRef.current = true;
    }
  }, [earnOpportunityItem, dispatch, accountPkh]);

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

  const isKordFi = earnOpportunityItem?.type === EarnOpportunityTypeEnum.KORD_FI_SAVING;
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
          disabledIndexes={disabledTabSwitcherIndices}
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
      <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />
    </>
  );
};
