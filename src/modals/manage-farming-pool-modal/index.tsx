import { RouteProp, useRoute } from '@react-navigation/native';
import { FormikProvider } from 'formik';
import { noop } from 'lodash-es';
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { PoolType } from 'src/apis/quipuswap-staking/types';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadSingleFarmActions, loadSingleFarmStakeActions } from 'src/store/farms/actions';
import {
  useFarmSelector,
  useFarmsLoadingSelector,
  useStakeIsInitializedSelector,
  useStakeLoadingSelector,
  useStakeSelector
} from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from './selectors';
import { useManageFarmingPoolModalStyles } from './styles';
import { useFarmTokens } from './use-farm-tokens';
import { useStakeFormik } from './use-stake-formik';

export const ManageFarmingPoolModal: FC = () => {
  const params = useRoute<RouteProp<ModalsParamList, ModalsEnum.ManageFarmingPool>>().params;
  const styles = useManageFarmingPoolModalStyles();
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef<number | undefined>(-1);
  const dispatch = useDispatch();

  const farm = useFarmSelector(params.id, params.version);
  const farmIsLoading = useFarmsLoadingSelector();
  const farmLevel = farm?.blockInfo.level;
  const stake = useStakeSelector(params.id, params.version);
  const stakeIsInitialized = useStakeIsInitializedSelector(params.id, params.version);
  const stakeIsLoading = useStakeLoadingSelector(params.id, params.version);

  const pageIsLoading =
    (farmIsLoading && !isDefined(farm)) || !stakeIsInitialized || (stakeIsLoading && !isDefined(stake));

  const stakeFormik = useStakeFormik(params.id, params.version);
  const { errors: formErrors, submitForm, setFieldTouched, setFieldValue, values } = stakeFormik;
  const { asset } = values.assetAmount;

  const assetsList = useFarmTokens(farm);
  const prevAssetsListRef = useRef(assetsList);
  const { filteredAssetsList, setSearchValue: setSearchValueFromTokens } = useFilteredAssetsList(
    assetsList,
    false,
    true
  );

  const handleAssetAmountChange = useCallback(() => {
    setFieldTouched('assetAmount', true);
  }, []);

  useEffect(() => {
    if (prevAssetsListRef.current === assetsList) {
      return;
    }

    const newAsset = assetsList.find(
      ({ address, id }) => toTokenSlug(address, id) === toTokenSlug(asset.address, asset.id)
    );
    if (isDefined(newAsset)) {
      setFieldValue('assetAmount.asset', newAsset);
    }
    prevAssetsListRef.current = assetsList;
  }, [assetsList, asset, setFieldValue]);

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

  const disabledTabSwitcherIndices = useMemo(() => (isDefined(stake?.stakeId) ? [] : [1]), [stake]);

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer isFullScreenMode>
        <>
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
          {!pageIsLoading && farm?.item.type === PoolType.STABLESWAP && (
            <FormikProvider value={stakeFormik}>
              <View style={styles.formContainer}>
                <Divider size={formatSize(16)} />
                <Text style={styles.depositPrompt}>
                  Deposit {asset.symbol} or other tokens. If you select other token it will be automatically swapped to{' '}
                  {asset.symbol}.
                </Text>
                <Divider size={formatSize(24)} />
                <FormAssetAmountInput
                  name="assetAmount"
                  label="Amount"
                  isSearchable
                  maxButton
                  assetsList={filteredAssetsList}
                  onValueChange={handleAssetAmountChange}
                  setSearchValue={setSearchValueFromTokens}
                  testID={ManageFarmingPoolModalSelectors.amountInput}
                />
              </View>
            </FormikProvider>
          )}
          {isDefined(farm) && farm.item.type !== PoolType.STABLESWAP && (
            <Text style={styles.notSupportedText}>Non-stableswap farms are not supported yet</Text>
          )}
        </>
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargePrimary
          title="Deposit"
          disabled={pageIsLoading || farm?.item.type !== PoolType.STABLESWAP || Object.keys(formErrors).length > 0}
          onPress={submitForm}
          testID={ManageFarmingPoolModalSelectors.depositButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
