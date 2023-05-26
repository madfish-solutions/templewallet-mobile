import { RouteProp, useRoute } from '@react-navigation/native';
import { noop } from 'lodash-es';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { PoolType } from 'src/apis/quipuswap-staking/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadAllFarmsActions, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import { useFarmSelector, useFarmsLoadingSelector, useLastStakesSelector } from 'src/store/farms/selectors';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { formatTimespan } from 'src/utils/date.utils';
import { isDefined } from 'src/utils/is-defined';

import { DetailsCard } from './details-card';
import { ManageFarmingPoolModalSelectors } from './selectors';
import { useManageFarmingPoolModalStyles } from './styles';
import { WithdrawForm } from './withdraw-form';
import { useWithdrawFormik } from './withdraw-form/use-withdraw-formik';

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
  const vestingPeriodSeconds = Number(farm?.item.vestingPeriodSeconds ?? 0);
  const formattedVestingPeriod = formatTimespan(vestingPeriodSeconds * 1000, { roundingMethod: 'ceil', unit: 'day' });
  const pageIsLoading = farmIsLoading && !isDefined(farm);
  const theme = useThemeSelector();
  const [tabIndex, setTabIndex] = useState(0);

  const withdrawFormik = useWithdrawFormik(params.id, params.version);
  const { errors: formErrors, submitForm, isSubmitting } = withdrawFormik;

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

  usePageAnalytic(ModalsEnum.ManageFarmingPool);

  const disabledTabSwitcherIndices = useMemo(() => (isDefined(stake?.lastStakeId) ? [] : [1]), [stake]);

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer isFullScreenMode>
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
        {!pageIsLoading && farm?.item.type === PoolType.STABLESWAP && (
          <View style={styles.content}>
            {tabIndex === 1 && (
              <>
                <WithdrawForm farm={farm} formik={withdrawFormik} stake={stake} />
                <Divider size={formatSize(16)} />
              </>
            )}
            <View style={styles.detailsTitle}>
              <View style={styles.farmTypeIconWrapper}>
                <Icon
                  name={theme === ThemesEnum.dark ? IconNameEnum.QuipuSwapDark : IconNameEnum.QuipuSwap}
                  size={formatSize(16)}
                />
              </View>
              <Divider size={formatSize(8)} />
              <Text style={styles.detailsTitleText}>Quipuswap Farming Details</Text>
            </View>
            <Divider size={formatSize(16)} />
            <DetailsCard farm={farm.item} stake={stake} shouldShowClaimRewardsButton={tabIndex === 0} />
            {tabIndex === 1 && vestingPeriodSeconds > 1 && (
              <>
                <Divider size={formatSize(16)} />
                <Disclaimer title="Long-term rewards vesting">
                  <Text style={styles.disclaimerDescriptionText}>
                    You can pick up your assets at any time, but the reward will be distributed within{' '}
                    <Text style={styles.emphasized}>{formattedVestingPeriod}</Text> of staking. Which means that if you
                    pick up sooner you won't get the entire reward.
                  </Text>
                </Disclaimer>
              </>
            )}
          </View>
        )}
        {!pageIsLoading && isDefined(farm) && farm.item.type !== PoolType.STABLESWAP && (
          <View style={styles.content}>
            <Text style={styles.notSupportedText}>Non-stableswap farms are not supported yet</Text>
          </View>
        )}
      </ScreenContainer>
      <ModalButtonsContainer>
        {tabIndex === 0 ? (
          <ButtonLargePrimary
            title="Deposit"
            disabled={true}
            onPress={noop}
            testID={ManageFarmingPoolModalSelectors.depositButton}
          />
        ) : (
          <ButtonLargePrimary
            title="Withdraw & Claim rewards"
            disabled={
              pageIsLoading ||
              farm?.item.type !== PoolType.STABLESWAP ||
              Object.keys(formErrors).length > 0 ||
              isSubmitting
            }
            onPress={submitForm}
            testID={ManageFarmingPoolModalSelectors.withdrawButton}
          />
        )}
      </ModalButtonsContainer>
    </>
  );
};
