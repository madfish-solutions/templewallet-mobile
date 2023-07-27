import { FormikProps, FormikProvider } from 'formik';
import { uniqBy } from 'lodash-es';
import React, { FC, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { QuestionAccordion } from 'src/components/question-accordion';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { TokensInputsEnum, useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useStakesLoadingSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { getTokenSlug, toTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

import { EXPECTED_STAKING_GAS_EXPENSE } from '../constants';
import { DetailsSection } from '../details-section';
import { ManageEarnOpportunityModalSelectors } from '../selectors';
import { VestingPeriodDisclaimers } from '../vesting-period-disclaimers';
import { quipuswapFarmsRisksPoints, youvesSavingsRisksPoints } from './constants';
import { useAssetAmountInputStylesConfig, useStakeFormStyles } from './styles';
import { StakeFormValues } from './use-stake-formik';

interface StakeFormProps {
  earnOpportunityItem: EarnOpportunity;
  stake?: UserStakeValueInterface;
  formik: FormikProps<StakeFormValues>;
  acceptRisksRef?: RefObject<View>;
}

export const StakeForm: FC<StakeFormProps> = ({ earnOpportunityItem, formik, stake, acceptRisksRef }) => {
  const itemIsFarm = isFarm(earnOpportunityItem);
  const { setFieldTouched, setFieldValue, values } = formik;
  const { asset } = values.assetAmount;

  const styles = useStakeFormStyles();
  const { stakeTokens, stakedToken } = useEarnOpportunityTokens(earnOpportunityItem);
  const { filteredTokensList: savingsAssetsList } = useFilteredSwapTokensList(TokensInputsEnum.From);
  const savingsAssetsListWithFallback = useMemo(
    () => uniqBy([stakedToken].concat(savingsAssetsList), getTokenSlug),
    [savingsAssetsList, stakedToken]
  );
  const assetsList = itemIsFarm ? stakeTokens : savingsAssetsListWithFallback;
  const assetAmountInputStylesConfig = useAssetAmountInputStylesConfig();
  const prevAssetsListRef = useRef(assetsList);
  const leadingTokens = useMemo(() => (itemIsFarm ? undefined : [stakedToken]), [itemIsFarm, stakedToken]);
  const { filteredAssetsList, setSearchValue: setSearchValueFromTokens } = useFilteredAssetsList(
    assetsList,
    false,
    true,
    leadingTokens
  );
  const risksPoints = itemIsFarm ? quipuswapFarmsRisksPoints : youvesSavingsRisksPoints;

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
          expectedGasExpense={EXPECTED_STAKING_GAS_EXPENSE}
          isSearchable
          isSingleAsset={assetsList.length === 1}
          maxButton
          assetsList={filteredAssetsList}
          stylesConfig={assetAmountInputStylesConfig}
          onValueChange={handleAssetAmountChange}
          setSearchValue={setSearchValueFromTokens}
          testID={ManageEarnOpportunityModalSelectors.amountInput}
        />
        <Divider size={formatSize(16)} />
        <DetailsSection
          earnOpportunityItem={earnOpportunityItem}
          stake={stake}
          shouldShowClaimRewardsButton={itemIsFarm}
          loading={stakesLoading && !isDefined(stake)}
        />
        <Divider size={formatSize(16)} />
        <VestingPeriodDisclaimers earnOpportunityItem={earnOpportunityItem} />
        <QuestionAccordion
          question="What are the main risks?"
          testID={ManageEarnOpportunityModalSelectors.mainRisksQuestion}
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
            testID={ManageEarnOpportunityModalSelectors.acceptRisksCheckbox}
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
