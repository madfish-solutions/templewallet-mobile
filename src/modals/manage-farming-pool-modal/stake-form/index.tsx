import { FormikProvider } from 'formik';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { FormAssetAmountInput } from 'src/form/form-asset-amount-input/form-asset-amount-input';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { formatSize } from 'src/styles/format-size';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { isDefined } from 'src/utils/is-defined';

import { EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE } from '../constants';
import { ManageFarmingPoolModalSelectors } from '../selectors';
import { useStakeFormStyles } from './styles';
import { useStakeFormik } from './use-stake-formik';

interface StakeFormProps {
  farm: SingleFarmResponse;
  formik: ReturnType<typeof useStakeFormik>;
}

export const StakeForm: FC<StakeFormProps> = ({ farm, formik }) => {
  const { setFieldTouched, setFieldValue, values } = formik;
  const { asset } = values.assetAmount;

  const styles = useStakeFormStyles();
  const { stakeTokens: assetsList } = useFarmTokens(farm.item);
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
      <View>
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
          expectedGasExpense={
            farm.item.type === FarmPoolTypeEnum.STABLESWAP ? EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE : undefined
          }
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
