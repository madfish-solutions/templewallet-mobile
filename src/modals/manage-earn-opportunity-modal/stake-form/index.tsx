import { FormikProvider } from 'formik';
import React, { FC, RefObject, useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { QuestionAccordion } from 'src/components/question-accordion';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { useStakesLoadingSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { isFarm } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

import { EXPECTED_STAKING_GAS_EXPENSE } from '../constants';
import { DetailsSection } from '../details-section';
import { ManageEarnOpportunityModalSelectors } from '../selectors';
import { VestingPeriodDisclaimers } from '../vesting-period-disclaimers';
import { quipuswapFarmsRisksPoints, youvesSavingsRisksPoints } from './constants';
import { useStakeFormStyles } from './styles';
import { useEarnOpportunityTokens } from './use-earn-opportunity-tokens';
import { useStakeFormik } from './use-stake-formik';

interface StakeFormProps {
  earnOpportunityItem: EarnOpportunity;
  stake?: UserStakeValueInterface;
  formik: ReturnType<typeof useStakeFormik>;
  acceptRisksRef?: RefObject<View>;
}

export const StakeForm: FC<StakeFormProps> = ({ earnOpportunityItem, formik, stake, acceptRisksRef }) => {
  const itemIsFarm = isFarm(earnOpportunityItem);
  const { setFieldTouched, setFieldValue, values } = formik;
  const { asset } = values.assetAmount;

  const styles = useStakeFormStyles();
  const assetsList = useEarnOpportunityTokens(earnOpportunityItem);
  const prevAssetsListRef = useRef(assetsList);
  const { filteredAssetsList, setSearchValue: setSearchValueFromTokens } = useFilteredAssetsList(
    assetsList,
    false,
    true
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
      <View style={styles.formContainer}>
        <Text style={styles.depositPrompt}>
          {itemIsFarm
            ? 'You can choose any asset from the provided list for your deposit. The selected asset will be automatically converted by Temple Wallet.'
            : 'You can choose asset from the provided list for your deposit.'}
        </Text>
        <Divider size={formatSize(24)} />
        <FormAssetAmountInput
          name="assetAmount"
          label="Amount"
          balanceValueStyles={styles.balanceText}
          expectedGasExpense={EXPECTED_STAKING_GAS_EXPENSE}
          isSearchable
          maxButton
          assetsList={filteredAssetsList}
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
