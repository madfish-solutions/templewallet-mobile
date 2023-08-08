import { FormikProps, FormikProvider } from 'formik';
import React, { FC, RefObject, useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { QuestionAccordion } from 'src/components/question-accordion';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useStakesLoadingSelector } from 'src/store/farms/selectors';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { isDefined } from 'src/utils/is-defined';

import { EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE } from '../constants';
import { DetailsSection } from '../details-section';
import { ManageFarmingPoolModalSelectors } from '../selectors';
import { VestingPeriodDisclaimers } from '../vesting-period-disclaimers';
import { liquidityBakingRisksPoints, quipuswapFarmsRisksPoints } from './constants';
import { useAssetAmountInputStylesConfig, useStakeFormStyles } from './styles';
import { StakeFormValues } from './use-stake-formik';

interface StakeFormProps {
  farm: SingleFarmResponse;
  stake?: UserStakeValueInterface;
  formik: FormikProps<StakeFormValues>;
  acceptRisksRef?: RefObject<View>;
}

export const StakeForm: FC<StakeFormProps> = ({ farm, formik, stake, acceptRisksRef }) => {
  const { setFieldTouched, setFieldValue, values } = formik;
  const { asset } = values.assetAmount;

  const styles = useStakeFormStyles();
  const assetAmountInputStylesConfig = useAssetAmountInputStylesConfig();
  const { stakeTokens: assetsList } = useFarmTokens(farm.item);
  const prevAssetsListRef = useRef(assetsList);
  const { filteredAssetsList, setSearchValue: setSearchValueFromTokens } = useFilteredAssetsList(
    assetsList,
    false,
    true
  );
  const risksPoints =
    farm.item.type === FarmPoolTypeEnum.LIQUIDITY_BAKING ? liquidityBakingRisksPoints : quipuswapFarmsRisksPoints;

  const stakesLoading = useStakesLoadingSelector();

  const handleAssetAmountChange = useCallback(() => {
    setFieldTouched('assetAmount', true);
  }, []);

  useEffect(() => {
    if (assetsList.length > 0) {
      setFieldValue('assetAmount.asset', assetsList[0]);
    }
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

  return (
    <FormikProvider value={formik}>
      <View>
        <Text style={styles.depositPrompt}>
          You can choose any asset from the provided list for your deposit. The selected asset will be automatically
          converted by Temple Wallet.
        </Text>
        <Divider size={formatSize(24)} />
        <FormAssetAmountInput
          name="assetAmount"
          label="Amount"
          expectedGasExpense={
            farm.item.type === FarmPoolTypeEnum.STABLESWAP ? EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE : undefined
          }
          isSearchable
          maxButton
          assetsList={filteredAssetsList}
          stylesConfig={assetAmountInputStylesConfig}
          onValueChange={handleAssetAmountChange}
          setSearchValue={setSearchValueFromTokens}
          testID={ManageFarmingPoolModalSelectors.amountInput}
        />
        <Divider size={formatSize(16)} />
        <DetailsSection
          farm={farm.item}
          stake={stake}
          shouldShowClaimRewardsButton={farm.item.type !== FarmPoolTypeEnum.LIQUIDITY_BAKING}
          loading={stakesLoading && !isDefined(stake)}
        />
        <Divider size={formatSize(16)} />
        <VestingPeriodDisclaimers farm={farm.item} />
        <QuestionAccordion
          question="What are the main risks?"
          testID={ManageFarmingPoolModalSelectors.mainRisksQuestion}
        >
          {risksPoints.map((point, index) => (
            <React.Fragment key={index}>
              <View style={styles.listItem}>
                <Text style={styles.listItemBullet}>•</Text>
                <Text style={styles.listItemText}>{point}</Text>
              </View>
              {index !== risksPoints.length - 1 && <Divider size={formatSize(5)} />}
            </React.Fragment>
          ))}
        </QuestionAccordion>
        <Divider size={formatSize(16)} />
        <View ref={acceptRisksRef}>
          <FormCheckbox
            testID={ManageFarmingPoolModalSelectors.acceptRisksCheckbox}
            size={formatSize(20)}
            name="acceptRisks"
          >
            <Text style={styles.acceptRisksText}>Accept risks</Text>
          </FormCheckbox>
        </View>
      </View>
    </FormikProvider>
  );
};
