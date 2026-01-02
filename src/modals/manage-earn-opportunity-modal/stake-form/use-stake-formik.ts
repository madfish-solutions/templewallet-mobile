import { useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { object as objectSchema, boolean as booleanSchema, SchemaOf } from 'yup';

import { AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { assetAmountValidation, createAssetAmountWithMaxValidation } from 'src/form/validation/asset-amount';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useSelectedRpcUrlSelector, useSlippageSelector } from 'src/store/settings/settings-selectors';
import { useSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useCurrentAccountPkhSelector, useCurrentAccountTezosBalance } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { getNetworkGasTokenMetadata } from 'src/utils/network.utils';

import { EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE } from '../constants';

import { createStakeOperationParams } from './create-stake-operation-params';

export interface StakeFormValues {
  assetAmount: AssetAmountInterface;
  acceptRisks: boolean;
}

const forbidSubmitEventEarnOpportunityTypes: Array<EarnOpportunityTypeEnum | undefined> = [
  EarnOpportunityTypeEnum.YOUVES_SAVING
];

export const useStakeFormik = (earnOpportunity?: EarnOpportunity, stake?: UserStakeValueInterface) => {
  const { stakeTokens } = useEarnOpportunityTokens(earnOpportunity);
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const gasToken = getNetworkGasTokenMetadata(selectedRpcUrl);
  const canUseOnRamp = useCanUseOnRamp();
  const tezosBalance = useCurrentAccountTezosBalance();
  const accountPkh = useCurrentAccountPkhSelector();
  const { data: threeRouteTokens } = useSwapTokensSelector();
  const tezos = useReadOnlyTezosToolkit();
  const slippageTolerancePercentage = useSlippageSelector();
  const dispatch = useDispatch();
  const { trackEvent, trackErrorEvent } = useAnalytics();

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
        assetAmount: (objectSchema<any>() as SchemaOf<AssetAmountInterface>).when(value => {
          const selectedAsset = value?.asset;
          const isGasToken =
            isDefined(selectedAsset) && toTokenSlug(selectedAsset.address, selectedAsset.id) === TEZ_TOKEN_SLUG;

          if (isGasToken) {
            return assetAmountValidation;
          }

          return createAssetAmountWithMaxValidation(
            gasToken,
            earnOpportunity?.type === EarnOpportunityTypeEnum.STABLESWAP
              ? EXPECTED_STABLESWAP_STAKING_GAS_EXPENSE
              : undefined
          );
        }),
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

      if (canUseOnRamp && toTokenSlug(asset.address, asset.id) === TEZ_TOKEN_SLUG && amount.gt(tezosBalance)) {
        dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));

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
        const internalError = error instanceof AnalyticsError ? error.error : error;
        const additionalProperties = error instanceof AnalyticsError ? error.additionalProperties : {};
        trackErrorEvent('EarnOpportunityStakeError', internalError, [accountPkh], {
          stakeFormInput: {
            earnOpportunity,
            amount,
            asset,
            rpcUrl: tezos.rpc.getRpcUrl(),
            lastStakeId: stake?.lastStakeId,
            threeRouteTokens,
            slippageTolerancePercentage
          },
          ...additionalProperties
        });
      }
    },
    [
      earnOpportunity,
      canUseOnRamp,
      tezosBalance,
      dispatch,
      trackEvent,
      trackErrorEvent,
      tezos,
      accountPkh,
      stake?.lastStakeId,
      threeRouteTokens,
      slippageTolerancePercentage
    ]
  );

  return useFormik<StakeFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
};
