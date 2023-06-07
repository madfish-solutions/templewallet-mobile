import { FormikProvider } from 'formik';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Disclaimer } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { QuestionAccordion } from 'src/components/question-accordion';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { FormCheckbox } from 'src/form/form-checkbox';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { formatTimespan, SECONDS_IN_DAY } from 'src/utils/date.utils';
import { isDefined } from 'src/utils/is-defined';

import { EXPECTED_STAKING_GAS_EXPENSE } from '../constants';
import { ManageFarmingPoolModalSelectors } from '../selectors';
import { useStakeFormStyles } from './styles';
import { useFarmTokens } from './use-farm-tokens';
import { useStakeFormik } from './use-stake-formik';

interface StakeFormProps {
  farm: SingleFarmResponse;
  formik: ReturnType<typeof useStakeFormik>;
}

const risksPoints = [
  'The value of a yield-generating asset may not perfectly track its reference value, however with the conversion rights, the holder has a protection against significant price differences that may occur.',
  'There is a risk that the collateral is not managed adequately and, in extreme scenarios, the protection via the conversion can no longer be kept. Such situations may require a liquidation of YOU staked tokens.',
  'Liquidity providers consider the risk of impermanent loss, however, due to the nature of the youves flat-curves (CFMM) and the highly-correlated asset pairs, such risks are much lower than on constant product market maker (CPMM) DEXs with uncorrelated pairs.'
];

export const StakeForm: FC<StakeFormProps> = ({ farm, formik }) => {
  const { setFieldTouched, setFieldValue, values } = formik;
  const { asset } = values.assetAmount;

  const styles = useStakeFormStyles();
  const assetsList = useFarmTokens(farm);
  const prevAssetsListRef = useRef(assetsList);
  const { filteredAssetsList, setSearchValue: setSearchValueFromTokens } = useFilteredAssetsList(
    assetsList,
    false,
    true
  );

  const vestingPeriodSeconds = Number(farm.item.vestingPeriodSeconds);
  const formattedVestingPeriod = formatTimespan(vestingPeriodSeconds * 1000, { roundingMethod: 'ceil', unit: 'day' });

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
        <Divider size={formatSize(16)} />
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
        {vestingPeriodSeconds >= SECONDS_IN_DAY && (
          <>
            <Disclaimer title="Long-term rewards vesting">
              <Text style={styles.disclaimerDescriptionText}>
                You can pick up your assets at any time, but the reward will be distributed within{' '}
                <Text style={styles.emphasized}>{formattedVestingPeriod}</Text> of staking. Which means that if you pick
                up sooner you won't get the entire reward.
              </Text>
            </Disclaimer>
            <Divider size={formatSize(16)} />
          </>
        )}
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
        <FormCheckbox
          testID={ManageFarmingPoolModalSelectors.acceptRisksCheckbox}
          size={formatSize(20)}
          name="acceptRisks"
        >
          <Text style={styles.acceptRisksText}>Accept risks</Text>
        </FormCheckbox>
      </View>
    </FormikProvider>
  );
};
