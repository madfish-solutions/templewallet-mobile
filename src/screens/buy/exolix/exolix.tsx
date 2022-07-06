import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';

import { ExternalLinkButton } from '../../../components/icon/external-link-button/external-link-button';
// import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
// import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
// import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { EXOLIX_CONTACT_LINK } from './config';
// import { ExolixSelectors } from './exolix.selectors';

// const steps = ['step 1', 'step 2', 'step 3', 'step 4'];

export const Exolix: FC = () => {
  // const { trackEvent } = useAnalytics();
  // const { publicKeyHash } = useSelectedAccountSelector();
  const [step] = useState<number>(0);
  // const [isError, setIsError] = useState(false);
  // const [exchangeData, setExchangeData] = useStorage<ExchangeDataInterface | null>(
  //   `topup_exchange_data_state_${publicKeyHash}`,
  //   null
  // );

  // const handleTrackSupportSubmit = useCallback(() => {
  //   let event: ExolixSelectors;
  //   switch (step) {
  //     case 2:
  //       event = ExolixSelectors.TopupSecondStepSupport;
  //       break;
  //     case 3:
  //       event = ExolixSelectors.TopupThirdStepSupport;
  //       break;
  //     default:
  //       event = ExolixSelectors.TopupFourthStepSubmit;
  //       break;
  //   }

  //   return trackEvent(event, AnalyticsEventCategory.ButtonPress);
  // }, [step, trackEvent]);

  return (
    <View>
      {/* <Stepper style={{ marginTop: '64px' }} steps={steps} currentStep={step} />
      {step === 0 && (
        <InitialStep
          isError={isError}
          setIsError={setIsError}
          exchangeData={exchangeData}
          setExchangeData={setExchangeData}
          setStep={setStep}
        />
      )}
      {step === 1 && (
        <ApproveStep
          exchangeData={exchangeData}
          setExchangeData={setExchangeData}
          setStep={setStep}
          isError={isError}
          setIsError={setIsError}
        />
      )}
      {(step === 2 || step === 3 || step === 4) && (
        <ExchangeStep
          exchangeData={exchangeData}
          setExchangeData={setExchangeData}
          setStep={setStep}
          step={step}
          isError={isError}
          setIsError={setIsError}
        />
      )} */}
      {step >= 1 && (
        <ExternalLinkButton
          url={EXOLIX_CONTACT_LINK}
          // onClick={handleTrackSupportSubmit}
        >
          <Text>Support</Text>
        </ExternalLinkButton>
      )}
      <Text>
        The token exchange feature is provided by a third party. The Temple wallet is not responsible for the work of
        third-party services.
      </Text>
    </View>
  );
};
