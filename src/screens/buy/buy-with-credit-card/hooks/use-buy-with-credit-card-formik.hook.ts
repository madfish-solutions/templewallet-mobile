import { useFormik } from 'formik';
import { useCallback } from 'react';

import { getSignedMoonPayUrl } from 'src/apis/moonpay';
import { buildMtPelerinBuyUrl, createMtPelerinAddressProof, getMtPelerinOutputAmount } from 'src/apis/mt-pelerin';
import { MT_PELERIN_NETWORK } from 'src/apis/mt-pelerin/consts';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { useCryptoCurrenciesSelector, useFiatCurrenciesSelector } from 'src/store/buy-with-credit-card/selectors';
import { useIsInAppBrowserEnabledSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast } from 'src/toast/toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { PAIR_NOT_FOUND_MESSAGE } from 'src/utils/constants/buy-with-credit-card';
import { getAxiosQueryErrorMessage } from 'src/utils/get-axios-query-error-message';
import { isDefined } from 'src/utils/is-defined';
import { openUrl, useOpenUrlInAppBrowser } from 'src/utils/linking';

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
  const isInAppBrowserEnabled = useIsInAppBrowserEnabledSelector();
  const openUrlInAppBrowser = useOpenUrlInAppBrowser();
  const mtPelerinFiatCurrencies = useFiatCurrenciesSelector(TopUpProviderEnum.MtPelerin);
  const mtPelerinCryptoCurrencies = useCryptoCurrenciesSelector(TopUpProviderEnum.MtPelerin);

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

        if (!isDefined(inputAmount) || !isDefined(outputAmount) || !isDefined(values.paymentProvider?.outputAmount)) {
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
          case TopUpProviderEnum.MtPelerin: {
            const providerFiat = mtPelerinFiatCurrencies.find(({ code }) => code === inputSymbol);
            const providerCrypto = mtPelerinCryptoCurrencies.find(({ slug }) => slug === getOutput.asset.slug);

            if (!isDefined(providerFiat) || !isDefined(providerCrypto)) {
              throw new Error(PAIR_NOT_FOUND_MESSAGE);
            }

            await getMtPelerinOutputAmount(
              providerFiat.code,
              providerCrypto.code,
              inputAmount.toNumber(),
              MT_PELERIN_NETWORK
            );
            const proof = await createMtPelerinAddressProof(publicKeyHash);
            urlToOpen = buildMtPelerinBuyUrl({
              fiatCode: providerFiat.code,
              cryptoCode: providerCrypto.code,
              sourceAmount: inputAmount.toNumber(),
              network: MT_PELERIN_NETWORK,
              ...proof
            });
            break;
          }
          default:
            throw new Error('Payment provider is not selected');
        }

        if (isInAppBrowserEnabled) {
          openUrlInAppBrowser(urlToOpen);
        } else {
          await openUrl(urlToOpen, { rethrowError: true });
        }
      } catch (error) {
        trackErrorEvent('BuyWithCreditCardFormSubmitError', error, [publicKeyHash], { values });
        showErrorToast({ description: getAxiosQueryErrorMessage(error) });
      }
    },
    [
      isInAppBrowserEnabled,
      mtPelerinCryptoCurrencies,
      mtPelerinFiatCurrencies,
      openUrlInAppBrowser,
      publicKeyHash,
      trackEvent,
      trackErrorEvent
    ]
  );

  return useFormik<BuyWithCreditCardFormValues>({
    initialValues,
    validationSchema: BuyWithCreditCardValidationSchema,
    onSubmit: handleSubmit
  });
};
