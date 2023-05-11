import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { object as objectSchema, SchemaOf } from 'yup';

import { FarmVersionEnum } from 'src/apis/quipuswap-staking/types';
import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { createAssetAmountWithMaxValidation } from 'src/form/validation/asset-amount';
import { useFarmSelector } from 'src/store/farms/selectors';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { EXPECTED_STAKING_GAS_EXPENSE } from './constants';
import { useFarmTokens } from './use-farm-tokens';

interface StakeFormValues {
  assetAmount: AssetAmountInterface;
}

export const useStakeFormik = (farmId: string, farmVersion: FarmVersionEnum) => {
  const farm = useFarmSelector(farmId, farmVersion);
  const farmTokens = useFarmTokens(farm);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);

  const initialValues = useMemo(
    () => ({
      assetAmount: {
        asset: farmTokens[0] ?? emptyTezosLikeToken,
        amount: undefined
      }
    }),
    [farmTokens]
  );

  const validationSchema = useMemo<SchemaOf<StakeFormValues>>(
    () =>
      objectSchema().shape({
        assetAmount: createAssetAmountWithMaxValidation(gasToken, EXPECTED_STAKING_GAS_EXPENSE)
      }),
    [gasToken]
  );

  const handleSubmit = useCallback((values: StakeFormValues) => {
    console.log('TODO: stake', values);
  }, []);

  return useFormik<StakeFormValues>({
    initialValues,
    validationSchema,
    validateOnMount: true,
    onSubmit: handleSubmit
  });
};
