import { BigNumber } from 'bignumber.js';
import { secondsInHour } from 'date-fns';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { number as numberSchema, object as objectSchema, SchemaOf } from 'yup';

import { FarmVersionEnum, PoolType } from 'src/apis/quipuswap-staking/types';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { useFarmTokens } from 'src/hooks/use-farm-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useFarmSelector, useStakeSelector } from 'src/store/farms/selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { formatTimespan, SECONDS_IN_DAY } from 'src/utils/date.utils';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';

import { createWithdrawOperationParams } from './create-withdraw-operation-params';

export interface WithdrawTokenOption {
  token: TokenInterface;
  amount?: BigNumber;
}

interface WithdrawFormValues {
  amountOptionIndex: number;
  tokenOption: WithdrawTokenOption;
}

const validationSchema: SchemaOf<WithdrawFormValues> = objectSchema().shape({
  amountOptionIndex: numberSchema().required(),
  tokenOption: objectSchema().shape({}).required(makeRequiredErrorMessage('Token'))
});

export const useWithdrawFormik = (farmId: string, farmVersion: FarmVersionEnum) => {
  const farm = useFarmSelector(farmId, farmVersion);
  const { stakeTokens } = useFarmTokens(farm?.item);
  const { publicKeyHash } = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit();
  const stake = useStakeSelector(farm?.item.contractAddress ?? '');
  const dispatch = useDispatch();
  const { trackEvent } = useAnalytics();

  const initialValues = useMemo(
    () => ({
      amountOptionIndex: isDefined(farm) && farm.item.type !== PoolType.STABLESWAP ? 0 : 3,
      tokenOption: {
        token: stakeTokens[0] ?? emptyTezosLikeToken
      }
    }),
    [stakeTokens, farm]
  );

  const handleSubmit = useCallback(
    (values: WithdrawFormValues, helpers: FormikHelpers<WithdrawFormValues>) => {
      if (!isDefined(farm)) {
        return;
      }

      const doWithdraw = async () => {
        helpers.setSubmitting(true);
        const { tokenOption } = values;
        const { token } = tokenOption;
        const tokenIndex = stakeTokens.findIndex(farmToken => getTokenSlug(farmToken) === getTokenSlug(token));

        try {
          const opParams = await createWithdrawOperationParams(farm, tokenIndex, tezos, publicKeyHash, stake);
          dispatch(
            navigateAction(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams,
              testID: 'STAKE_TRANSACTION_SENT'
            })
          );
          trackEvent('WITHDRAW_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess);
        } catch (error) {
          showErrorToastByError(error, undefined, true);
          trackEvent('STAKE_FORM_SUBMIT_FAIL', AnalyticsEventCategory.FormSubmitFail);
        } finally {
          helpers.setSubmitting(false);
        }
      };

      if ((stake.rewardsDueDate ?? 0) < Date.now()) {
        void doWithdraw();
      } else {
        const vestingPeriodSeconds = Number(farm.item.vestingPeriodSeconds);
        doAfterConfirmation(
          vestingPeriodSeconds > SECONDS_IN_DAY
            ? 'It is a long-term farm. Your claimable rewards will be claimed along with your withdrawal. All further rewards will be lost.'
            : `It is a farm with a locked period of ${formatTimespan(vestingPeriodSeconds * 1000, {
                unit: vestingPeriodSeconds < secondsInHour ? 'minute' : 'hour',
                roundingMethod: 'ceil'
              })}. Your claimable rewards will be claimed along with your withdrawal. All further rewards will be lost.`,
          'Withdraw & Claim rewards',
          () => void doWithdraw()
        );
      }
      helpers.setSubmitting(false);
    },
    [stakeTokens, farm, tezos, publicKeyHash, stake, dispatch]
  );

  return useFormik<WithdrawFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });
};
