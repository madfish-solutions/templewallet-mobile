import { BigNumber } from 'bignumber.js';
import { secondsInHour } from 'date-fns';
import { useFormik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { number as numberSchema, object as objectSchema, SchemaOf } from 'yup';

import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { makeRequiredErrorMessage } from 'src/form/validation/messages';
import { useEarnOpportunityTokens } from 'src/hooks/use-earn-opportunity-tokens';
import { useReadOnlyTezosToolkit } from 'src/hooks/use-read-only-tezos-toolkit.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { navigateAction } from 'src/store/root-state.actions';
import { useSlippageSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { emptyTezosLikeToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { formatTimespan, MS_IN_SECOND, SECONDS_IN_DAY } from 'src/utils/date.utils';
import { isFarm } from 'src/utils/earn.utils';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { doAfterConfirmation } from 'src/utils/farm.utils';
import { isDefined } from 'src/utils/is-defined';

import { MINIMAL_DIVISIBLE_ATOMIC_AMOUNT, PERCENTAGE_OPTIONS } from '../constants';

import { createWithdrawOperationParams } from './create-withdraw-operation-params';

export interface WithdrawTokenOption {
  token: TokenInterface;
  amount?: BigNumber;
}

export interface WithdrawFormValues {
  amountOptionIndex: number;
  tokenOption: WithdrawTokenOption;
}

const validationSchema: SchemaOf<WithdrawFormValues> = objectSchema().shape({
  amountOptionIndex: numberSchema().required(),
  tokenOption: objectSchema().shape({}).required(makeRequiredErrorMessage('Token'))
});

const FIRST_PERCENTAGE_OPTION_INDEX = 0;
const LAST_PERCENTAGE_OPTION_INDEX = PERCENTAGE_OPTIONS.length - 1;

export const useWithdrawFormik = (earnOpportunity?: EarnOpportunity, stake?: UserStakeValueInterface) => {
  const { stakeTokens } = useEarnOpportunityTokens(earnOpportunity);
  const publicKeyHash = useCurrentAccountPkhSelector();
  const tezos = useReadOnlyTezosToolkit();
  const dispatch = useDispatch();
  const { trackEvent, trackErrorEvent } = useAnalytics();
  const slippageTolerance = useSlippageSelector();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const depositAmountAtomic = useMemo(
    () => new BigNumber(stake?.depositAmountAtomic ?? 0),
    [stake?.depositAmountAtomic]
  );
  const initialValues = useMemo(
    () => ({
      amountOptionIndex:
        isDefined(earnOpportunity) &&
        earnOpportunity.type !== EarnOpportunityTypeEnum.STABLESWAP &&
        depositAmountAtomic.gte(MINIMAL_DIVISIBLE_ATOMIC_AMOUNT)
          ? FIRST_PERCENTAGE_OPTION_INDEX
          : LAST_PERCENTAGE_OPTION_INDEX,
      tokenOption: {
        token: stakeTokens[0] ?? emptyTezosLikeToken
      }
    }),
    [stakeTokens, earnOpportunity, depositAmountAtomic]
  );

  const handleSubmit = useCallback(
    (values: WithdrawFormValues) => {
      if (!isDefined(earnOpportunity) || !isDefined(stake)) {
        return;
      }

      const { tokenOption, amountOptionIndex } = values;
      const { token } = tokenOption;
      trackEvent('WITHDRAW_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, {
        farmAddress: earnOpportunity.contractAddress,
        token: token.symbol
      });

      const doWithdraw = async () => {
        setIsSubmitting(true);
        const { tokenOption } = values;
        const { token } = tokenOption;
        const tokenIndex = stakeTokens.findIndex(farmToken => getTokenSlug(farmToken) === getTokenSlug(token));

        try {
          const opParams = await createWithdrawOperationParams(
            earnOpportunity,
            tokenIndex,
            tezos,
            publicKeyHash,
            stake,
            PERCENTAGE_OPTIONS[amountOptionIndex],
            slippageTolerance
          );
          dispatch(
            navigateAction(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams,
              testID: 'WITHDRAW_TRANSACTION_SENT'
            })
          );
          trackEvent('WITHDRAW_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess);
        } catch (error) {
          showErrorToastByError(error, undefined, true);
          trackEvent('WITHDRAW_FORM_SUBMIT_FAIL', AnalyticsEventCategory.FormSubmitFail);
          const internalError = error instanceof AnalyticsError ? error.error : error;
          const additionalProperties = error instanceof AnalyticsError ? error.additionalProperties : {};
          trackErrorEvent('EarnOpportunityDoWithdrawError', internalError, [publicKeyHash], {
            doWithdrawInput: {
              earnOpportunity,
              tokenIndex,
              rpcUrl: tezos.rpc.getRpcUrl(),
              stake,
              percentage: PERCENTAGE_OPTIONS[amountOptionIndex],
              slippageTolerance
            },
            ...additionalProperties
          });
        } finally {
          setIsSubmitting(false);
        }
      };

      if ((stake.rewardsDueDate ?? 0) < Date.now()) {
        void doWithdraw();
      } else {
        const vestingPeriodSeconds = Number(earnOpportunity.vestingPeriodSeconds);
        const { id, contractAddress } = earnOpportunity;
        const modalAnswerAnalyticsProperties = isFarm(earnOpportunity)
          ? {
              farmId: id,
              farmContractAddress: contractAddress
            }
          : {
              savingsItemId: id,
              savingsItemContractAddress: contractAddress
            };
        doAfterConfirmation(
          vestingPeriodSeconds > SECONDS_IN_DAY
            ? `It is a long-term ${
                isFarm(earnOpportunity) ? 'farm' : 'savings pool'
              }. Your claimable rewards will be claimed along with your withdrawal. All further rewards will be lost.`
            : `It is a farm with a locked period of ${formatTimespan(vestingPeriodSeconds * MS_IN_SECOND, {
                unit: vestingPeriodSeconds < secondsInHour ? 'minute' : 'hour',
                roundingMethod: 'ceil'
              })}. Your claimable rewards will be claimed along with your withdrawal. All further rewards will be lost.`,
          'Withdraw & Claim rewards',
          () => {
            trackEvent('WITHDRAW_MODAL_CONFIRM', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties);
            void doWithdraw();
          },
          () => trackEvent('WITHDRAW_MODAL_CANCEL', AnalyticsEventCategory.ButtonPress, modalAnswerAnalyticsProperties)
        );
      }
    },
    [
      stakeTokens,
      earnOpportunity,
      tezos,
      publicKeyHash,
      stake,
      dispatch,
      trackEvent,
      slippageTolerance,
      trackErrorEvent
    ]
  );

  const formik = useFormik<WithdrawFormValues>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit
  });

  return {
    formik,
    isSubmitting
  };
};
