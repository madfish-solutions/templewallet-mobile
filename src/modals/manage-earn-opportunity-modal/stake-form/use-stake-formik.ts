import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { object as objectSchema, boolean as booleanSchema, SchemaOf } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { createAssetAmountWithMaxValidation } from 'src/form/validation/asset-amount';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { EXPECTED_STAKING_GAS_EXPENSE } from '../constants';
import { createStakeOperationParams } from './create-stake-operation-params';

export interface StakeFormValues {
  assetAmount: AssetAmountInterface;
  acceptRisks: boolean;
}

export const useStakeFormik = (earnOpportunity?: EarnOpportunity, stake?: UserStakeValueInterface) => {
  const { stakeTokens } = useEarnOpportunityTokens(earnOpportunity);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);
  const selectedAccount = useSelectedAccountSelector();
  const { publicKeyHash: accountPkh } = selectedAccount;
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const initialValues = useMemo(
    () => ({
      assetAmount: {
        asset: stakeTokens[0] ?? emptyTezosLikeToken,
        amount: undefined
      },
      acceptRisks: false
    }),
    [stakeTokens]
  );

  const validationSchema = useMemo<SchemaOf<StakeFormValues>>(
    () =>
      objectSchema().shape({
        assetAmount: createAssetAmountWithMaxValidation(gasToken, EXPECTED_STAKING_GAS_EXPENSE),
        acceptRisks: booleanSchema().oneOf([true], 'Accept risks before depositing').required()
      }),
    [gasToken]
  );

  const handleSubmit = useCallback(
    async (values: StakeFormValues) => {
      const { asset, amount } = values.assetAmount;

      if (!isDefined(earnOpportunity) || !isDefined(amount)) {
        return;
      }

      try {
        const opParams = await createStakeOperationParams(
          earnOpportunity,
          amount,
          asset,
          tezos,
          accountPkh,
          stake?.lastStakeId
        );

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
    [earnOpportunity, tezos, accountPkh, trackEvent, stake?.lastStakeId, dispatch]
  );

  return useFormik<StakeFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
};
