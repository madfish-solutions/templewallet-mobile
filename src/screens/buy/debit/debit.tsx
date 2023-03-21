import React from 'react';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { useNetworkInfo } from '../../../hooks/use-network-info.hook';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../../utils/linking.util';
import { TopUpOption } from '../components/top-up-option/top-up-option';
import { useAliceBobPairInfo } from '../hooks/use-alice-bob-pair-info';
import { useSignedMoonPayUrl } from '../hooks/use-signed-moonpay-url';
import { useUtorgExchangeInfo } from '../hooks/use-utorg-exchange-info';
import { DebitSelectors } from './debit.selectors';

const CHAINBITS_TOPUP_URL = 'https://buy.chainbits.com/?crypto=FILM';

export const Debit = () => {
  const { trackEvent } = useAnalytics();
  const { navigate } = useNavigation();
  const { isTezosNode, isDcpNode } = useNetworkInfo();

  const { signedMoonPayUrl, isMoonPayError, isMoonPayDisabled } = useSignedMoonPayUrl();

  const { availableUtorgCurrencies, minUtorgExchangeAmount, maxUtorgExchangeAmount, isUtorgError, isUtorgDisabled } =
    useUtorgExchangeInfo();

  const { minAliceBobExchangeAmount, maxAliceBobExchangeAmount, isAliceBobError, isAliceBobDisabled } =
    useAliceBobPairInfo();

  return (
    <>
      <Divider size={formatSize(16)} />
      {isTezosNode && (
        <>
          <TopUpOption
            title="Buy TEZ with MoonPay"
            iconName={IconNameEnum.MoonPay}
            onPress={() => {
              trackEvent(DebitSelectors.MoonPay, AnalyticsEventCategory.ButtonPress);
              openUrl(signedMoonPayUrl);
            }}
            disabled={isMoonPayDisabled}
            isError={isMoonPayError}
          />
          <TopUpOption
            title="Buy TEZ with UTORG"
            iconName={IconNameEnum.Utorg}
            onPress={() => {
              trackEvent(DebitSelectors.Utorg, AnalyticsEventCategory.ButtonPress);
              navigate(ScreensEnum.Utorg, {
                min: minUtorgExchangeAmount,
                max: maxUtorgExchangeAmount,
                currencies: availableUtorgCurrencies
              });
            }}
            disabled={isUtorgDisabled}
            isError={isUtorgError}
          />
          <TopUpOption
            title="Buy TEZ with Alice-Bob (UAH only)"
            iconName={IconNameEnum.AliceBob}
            onPress={() => {
              trackEvent(DebitSelectors.AliceBob, AnalyticsEventCategory.ButtonPress);
              navigate(ScreensEnum.AliceBob, { min: minAliceBobExchangeAmount, max: maxAliceBobExchangeAmount });
            }}
            disabled={isAliceBobDisabled}
            isError={isAliceBobError}
          />
        </>
      )}
      {isDcpNode && (
        <TopUpOption
          title="Buy FILM with ChainBits"
          imageSource={require('../assets/ChainBits.png')}
          onPress={() => {
            trackEvent(DebitSelectors.ChainBits, AnalyticsEventCategory.ButtonPress);
            openUrl(CHAINBITS_TOPUP_URL);
          }}
        />
      )}
    </>
  );
};
