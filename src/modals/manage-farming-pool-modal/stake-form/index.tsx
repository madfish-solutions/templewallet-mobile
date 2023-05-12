import { FormikProvider } from 'formik';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { SingleFarmResponse } from 'src/apis/quipuswap/types';
import { Divider } from 'src/components/divider/divider';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

import { ManageFarmingPoolModalSelectors } from '../selectors';
import { useStakeFormStyles } from './styles';
import { useFarmTokens } from './use-farm-tokens';
import { useStakeFormik } from './use-stake-formik';

interface StakeFormProps {
  farm: SingleFarmResponse;
  formik: ReturnType<typeof useStakeFormik>;
}

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
  );
};
