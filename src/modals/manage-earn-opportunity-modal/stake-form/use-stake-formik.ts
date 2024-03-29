import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { object as objectSchema, boolean as booleanSchema, SchemaOf } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { createAssetAmountWithMaxValidation } from 'src/form/validation/asset-amount';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector, useSlippageSelector } from 'src/store/settings/settings-selectors';
import { useSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { isDefined } from 'src/utils/is-defined';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE } from '../constants';

import { createStakeOperationParams } from './create-stake-operation-params';

export interface StakeFormValues {
  assetAmount: AssetAmountInterface;
  acceptRisks: boolean;
}

const forbidSubmitEventEarnOpportunityTypes: Array<EarnOpportunityTypeEnum | undefined> = [
  EarnOpportunityTypeEnum.KORD_FI_SAVING,
  EarnOpportunityTypeEnum.YOUVES_SAVING
];

export const useStakeFormik = (earnOpportunity?: EarnOpportunity, stake?: UserStakeValueInterface) => {
  const { stakeTokens } = useEarnOpportunityTokens(earnOpportunity);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);
  const accountPkh = useCurrentAccountPkhSelector();
  const { data: threeRouteTokens } = useSwapTokensSelector();
  const tezos = useReadOnlyTezosToolkit();
  const slippageTolerancePercentage = useSlippageSelector();
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
        assetAmount: createAssetAmountWithMaxValidation(
          gasToken,
          earnOpportunity?.type === EarnOpportunityTypeEnum.STABLESWAP
            ? EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE
            : undefined
        ),
        acceptRisks: booleanSchema().oneOf([true], 'Accept risks before depositing').required()
      }),
    [gasToken, earnOpportunity?.type]
  );

  const handleSubmit = useCallback(
    async (values: StakeFormValues) => {
      const { asset, amount } = values.assetAmount;

      if (!isDefined(earnOpportunity) || !isDefined(amount)) {
        return;
      }

      if (!forbidSubmitEventEarnOpportunityTypes.includes(earnOpportunity.type)) {
        trackEvent('STAKE_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, {
          farmAddress: earnOpportunity.contractAddress,
          token: asset.symbol,
          atomicAmount: amount.toFixed()
        });
      }
      try {
        const opParams = await createStakeOperationParams(
          earnOpportunity,
          amount,
          asset,
          tezos,
          accountPkh,
          stake?.lastStakeId,
          threeRouteTokens,
          slippageTolerancePercentage
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
        showErrorToastByError(error, undefined, true);
        trackEvent('STAKE_FORM_SUBMIT_FAIL', AnalyticsEventCategory.FormSubmitFail);
      }
    },
    [
      earnOpportunity,
      tezos,
      accountPkh,
      trackEvent,
      stake?.lastStakeId,
      threeRouteTokens,
      dispatch,
      slippageTolerancePercentage
    ]
  );

  return useFormik<StakeFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
};
