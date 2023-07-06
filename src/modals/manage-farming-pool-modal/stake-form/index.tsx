import { FormikProps, FormikProvider } from 'formik';
import React, { FC, RefObject, useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Divider } from 'src/components/divider/divider';
import { QuestionAccordion } from 'src/components/question-accordion';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { useStakesLoadingSelector } from 'src/store/farms/selectors';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

import { EXPECTED_STAKING_GAS_EXPENSE } from '../constants';
import { DetailsSection } from '../details-section';
import { ManageFarmingPoolModalSelectors } from '../selectors';
import { VestingPeriodDisclaimers } from '../vesting-period-disclaimers';
import { useStakeFormStyles } from './styles';
import { StakeFormValues } from './use-stake-formik';

interface StakeFormProps {
  farm: SingleFarmResponse;
  stake?: UserStakeValueInterface;
  formik: FormikProps<StakeFormValues>;
  acceptRisksRef?: RefObject<View>;
}

const risksPoints = [
  'Smart Contract Reliability: This pool operates using DEX smart contracts, farming smart contracts, QuipuSwap stable pools smart contracts and interacts with Yupana Lending protocol contracts. The safety of your assets is dependent on the reliability and security of these contracts. While external audits of smart contracts have been conducted, there is always a risk of potential vulnerabilities or unforeseen issues that could impact the safety of your assets.',
  'Stable Token Value: Stable tokens are designed to maintain a stable value relative to a benchmark, such as a fiat currency. However, there is a risk that the value of stable tokens may not perfectly track their benchmark value. Factors such as the conversion conditions and operational mechanisms specific to each stable token can influence its value. It is important to be aware of this potential risk when using stable tokens in this pool.',
  'Market Risk: Farming involves exposure to the performance and volatility of the assets in the liquidity pool. Fluctuations in the market value of the assets can impact the overall value of the farm and potentially lead to losses. It is essential to consider the risks associated with the specific assets and their market dynamics.',
  'Slippage: Slippage refers to the difference between the expected and actual execution price of a trade. In fast-moving markets or with illiquid assets, slippage can be significant and impact profitability.',
  'Regulatory and Compliance Risks: Depending on your jurisdiction, participating in farming may have legal and regulatory implications. It is important to ensure compliance with applicable laws, tax obligations, and any necessary licenses or permissions.'
];

export const StakeForm: FC<StakeFormProps> = ({ farm, formik, stake, acceptRisksRef }) => {
  const { setFieldTouched, setFieldValue, values } = formik;
  const { asset } = values.assetAmount;

  const styles = useStakeFormStyles();
  const { stakeTokens: assetsList } = useFarmTokens(farm?.item);
  const prevAssetsListRef = useRef(assetsList);
  const { filteredAssetsList, setSearchValue: setSearchValueFromTokens } = useFilteredAssetsList(
    assetsList,
    false,
    true
  );

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
          balanceValueStyles={styles.balanceText}
          expectedGasExpense={EXPECTED_STAKING_GAS_EXPENSE}
          isSearchable
          maxButton
          assetsList={filteredAssetsList}
          onValueChange={handleAssetAmountChange}
          setSearchValue={setSearchValueFromTokens}
          testID={ManageFarmingPoolModalSelectors.amountInput}
        />
        <Divider size={formatSize(16)} />
        <DetailsSection
          farm={farm.item}
          stake={stake}
          shouldShowClaimRewardsButton
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
