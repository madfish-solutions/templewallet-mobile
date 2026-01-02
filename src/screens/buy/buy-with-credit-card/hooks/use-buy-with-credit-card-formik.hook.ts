import { useFormik } from 'formik';
import { useCallback } from 'react';

import { getSignedMoonPayUrl } from 'src/apis/moonpay';
import { createOrder as createUtorgOrder } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking';

import { BuyWithCreditCardFormValues, BuyWithCreditCardValidationSchema } from '../form';

const CRYPTO_NETWORK_TEZOS_PLUG = {
  code: 'tezos',
  fullName: 'Tezos'
};

const DEFAULT_INPUT_CURRENCY = {
  code: 'USD',
  icon: 'https://static.moonpay.com/widget/currencies/usd.svg',
  name: 'US Dollar',
  precision: 2
};

const DEFAULT_OUTPUT_TOKEN = {
  code: 'XTZ',
  name: 'Tezos',
  icon: 'https://exolix.com/icons/coins/XTZ.png',
  network: CRYPTO_NETWORK_TEZOS_PLUG,
  slug: 'tez'
};

const initialValues: BuyWithCreditCardFormValues = {
  sendInput: {
    asset: DEFAULT_INPUT_CURRENCY,
    amount: undefined
  },
  getOutput: {
    asset: DEFAULT_OUTPUT_TOKEN,
    amount: undefined
  }
};

export const useBuyWithCreditCardFormik = () => {
  const { trackEvent, trackErrorEvent } = useAnalytics();
  const publicKeyHash = useCurrentAccountPkhSelector();

  const handleSubmit = useCallback(
    async (values: BuyWithCreditCardFormValues) => {
      try {
        const { sendInput, getOutput } = values;
        const inputAmount = sendInput.amount;
        const inputSymbol = sendInput.asset.code;
        const outputAmount = getOutput.amount;
        const outputSymbol = getOutput.asset.code;
        trackEvent('BUY_WITH_CREDIT_CARD_FORM_SUBMIT', AnalyticsEventCategory.FormSubmit, {
          inputAmount: inputAmount?.toString(),
          inputAsset: inputSymbol,
          outputAmount: outputAmount?.toString(),
          outputAsset: outputSymbol,
          provider: values.paymentProvider?.name
        });

        if (!isDefined(inputAmount) || !isDefined(outputAmount)) {
          return;
        }

        let urlToOpen: string;
        switch (values.paymentProvider?.id) {
          case TopUpProviderEnum.MoonPay:
            urlToOpen = await getSignedMoonPayUrl(
              outputSymbol,
              '#ed8936',
              publicKeyHash,
              inputAmount.toNumber(),
              inputSymbol
            );
            break;
          default:
            urlToOpen = await createUtorgOrder(outputAmount.toNumber(), inputSymbol, publicKeyHash, outputSymbol);
            break;
        }
        openUrl(urlToOpen);
      } catch (error) {
        trackErrorEvent('BuyWithCreditCardFormSubmitError', error, [publicKeyHash], { values });
        showErrorToast({ description: getAxiosQueryErrorMessage(error) });
      }
    },
    [publicKeyHash, trackEvent, trackErrorEvent]
  );

  return useFormik<BuyWithCreditCardFormValues>({
    initialValues,
    validationSchema: BuyWithCreditCardValidationSchema,
    onSubmit: handleSubmit
  });
};
