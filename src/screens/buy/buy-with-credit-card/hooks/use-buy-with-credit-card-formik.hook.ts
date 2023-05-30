import { useFormik } from 'formik';
import { useCallback } from 'react';

import { createOrder as createAliceBobOrder } from 'src/apis/alice-bob';
import { getSignedMoonPayUrl } from 'src/apis/moonpay';
import { createBinanceConnectTradeOrder } from 'src/apis/temple-static';
import { createOrder as createUtorgOrder } from 'src/apis/utorg';
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useUserIdSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking.util';

import { BuyWithCreditCardFormValues, BuyWithCreditCardValidationSchema } from '../form';

const DEFAULT_INPUT_CURRENCY = {
  code: 'USD',
  icon: 'https://static.moonpay.com/widget/currencies/usd.svg',
  name: 'US Dollar',
  network: '',
  networkFullName: '',
  precision: 2,
  type: TopUpInputTypeEnum.Fiat
};
const DEFAULT_OUTPUT_TOKEN = {
  code: 'XTZ',
  name: 'Tezos',
  icon: 'https://exolix.com/icons/coins/XTZ.png',
  network: 'tezos',
  networkFullName: 'Tezos',
  slug: 'tez',
  type: TopUpInputTypeEnum.Crypto
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
  const { trackEvent } = useAnalytics();
  const { publicKeyHash } = useSelectedAccountSelector();
  const userId = useUserIdSelector();

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
          case TopUpProviderEnum.Utorg:
            urlToOpen = await createUtorgOrder(outputAmount.toNumber(), inputSymbol, publicKeyHash, outputSymbol);
            break;
          case TopUpProviderEnum.BinanceConnect:
            urlToOpen = await createBinanceConnectTradeOrder(
              inputSymbol,
              outputSymbol,
              inputAmount.toFixed(),
              publicKeyHash
            );
            break;
          default:
            const { payUrl } = await createAliceBobOrder(false, inputAmount.toFixed(), userId, publicKeyHash);
            urlToOpen = payUrl;
        }
        openUrl(urlToOpen);
      } catch (error) {
        showErrorToast({ description: getAxiosQueryErrorMessage(error) });
      }
    },
    [trackEvent]
  );

  return useFormik<BuyWithCreditCardFormValues>({
    initialValues,
    validationSchema: BuyWithCreditCardValidationSchema,
    onSubmit: handleSubmit
  });
};
