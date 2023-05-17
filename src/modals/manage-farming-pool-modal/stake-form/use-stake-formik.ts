import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { object as objectSchema, SchemaOf } from 'yup';

import { FarmVersionEnum } from 'src/apis/quipuswap/types';
import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { createAssetAmountWithMaxValidation } from 'src/form/validation/asset-amount';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useFarmSelector, useStakeSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { EXPECTED_STAKING_GAS_EXPENSE } from '../constants';
import { createStakeOperationParams } from './create-stake-operation-params';
import { useFarmTokens } from './use-farm-tokens';

interface StakeFormValues {
  assetAmount: AssetAmountInterface;
}

export const useStakeFormik = (farmId: string, farmVersion: FarmVersionEnum) => {
  const farm = useFarmSelector(farmId, farmVersion);
  const farmTokens = useFarmTokens(farm);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);
  const selectedAccount = useSelectedAccountSelector();
  const { publicKeyHash: accountPkh } = selectedAccount;
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const stake = useStakeSelector(farm?.item.contractAddress ?? '');
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

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

  const handleSubmit = useCallback(
    async (values: StakeFormValues) => {
      const { asset, amount } = values.assetAmount;

      if (!isDefined(farm) || !isDefined(amount)) {
        return;
      }

      try {
        const opParams = await createStakeOperationParams(farm, amount, asset, tezos, accountPkh, stake?.lastStakeId);

        dispatch(
          navigateAction(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams,
            testID: 'STAKE_TRANSACTION_SENT'
          })
        );
        trackEvent('STAKE_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess);
      } catch (error) {
        console.error(error);
        showErrorToastByError(error);
        trackEvent('STAKE_FORM_SUBMIT_FAIL', AnalyticsEventCategory.FormSubmitFail);
      }
    },
    [farm, farmTokens, tezos, accountPkh, trackEvent, stake?.lastStakeId, dispatch]
  );

  return useFormik<StakeFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
};
