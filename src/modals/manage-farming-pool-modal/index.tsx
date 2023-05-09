import { RouteProp, useRoute } from '@react-navigation/native';
import { noop } from 'lodash-es';
import React, { FC, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { ModalButtonsContainer } from 'src/components/modal-buttons-container/modal-buttons-container';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
// import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadSingleFarmActions } from 'src/store/farms/actions';
import { useFarmSelector, useFarmsLoadingSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from './selectors';
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

  useEffect(() => {
    console.log('x1', prevBlockLevelRef.current, blockLevel, farmLevel);
    if (prevBlockLevelRef.current === blockLevel || (isDefined(farmLevel) && farmLevel === blockLevel)) {
      return;
    }

    dispatch(loadSingleFarmActions.submit(params));
    prevBlockLevelRef.current = blockLevel;
  }, [blockLevel, farmLevel, dispatch, params]);

  usePageAnalytic(ModalsEnum.ManageFarmingPool);

  return (
    <>
      <ModalStatusBar />
      <ScreenContainer>
        <View style={styles.background}>
          <TextSegmentControl
            selectedIndex={0}
            values={['Deposit', 'Withdraw']}
            onChange={noop}
            testID={ManageFarmingPoolModalSelectors.tabSwitch}
          />
          <Divider size={formatSize(16)} />
          <Text style={styles.depositPrompt}>
            Deposit TEZ or other tokens. If you select other token it will be automatically swapped to TEZ.
          </Text>
          <Divider size={formatSize(24)} />
          <Text>{farmIsLoading ? 'Loading...' : JSON.stringify(farm, null, 2)}</Text>
          {/* <FormAssetAmountInput
          name="amountInput"
          label="Amount"
          isSearchable
          maxButton
          assetsList={inputTokensList}
          isLoading={isLoading}
          setSearchValue={setSearchValueFromTokens}
          onValueChange={handleAmountInputChange}
          testID={SwapFormSelectors.amountInput}
        /> */}
        </View>
      </ScreenContainer>
      <ModalButtonsContainer>
        <ButtonLargePrimary
          title="Deposit"
          disabled={true}
          onPress={noop}
          testID={ManageFarmingPoolModalSelectors.depositButton}
        />
      </ModalButtonsContainer>
    </>
  );
};
