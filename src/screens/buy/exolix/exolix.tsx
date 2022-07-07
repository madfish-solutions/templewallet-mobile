import React, { FC, useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Disclaimer } from '../../../components/disclaimer/disclaimer';
import { useExolixStep } from '../../../store/exolix/exolix-selectors';
import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { openUrl } from '../../../utils/linking.util';
import { ApproveStep } from './approve-step';
// import { useSelectedAccountSelector } from '../../../store/wallet/wallet-selectors';
// import { AnalyticsEventCategory } from '../../../utils/analytics/analytics-event.enum';
// import { useAnalytics } from '../../../utils/analytics/use-analytics.hook';
import { EXOLIX_CONTACT_LINK } from './config';
import { ExchangeStep } from './exchange-step';
import { ExolixSelectors } from './exolix.selectors';
import { InitialStep } from './initial-step';
// import { ExolixSelectors } from './exolix.selectors';

// const steps = ['step 1', 'step 2', 'step 3', 'step 4'];

export const Exolix: FC = () => {
  const { trackEvent } = useAnalytics();
  // const { publicKeyHash } = useSelectedAccountSelector();
  const step = useExolixStep();
  const [isError, setIsError] = useState(false);
  // const [exchangeData, setExchangeData] = useStorage<ExchangeDataInterface | null>(
  //   `topup_exchange_data_state_${publicKeyHash}`,
  //   null
  // );

  const handleTrackSupportSubmit = useCallback(() => {
    let event: ExolixSelectors;
    switch (step) {
      case 2:
        event = ExolixSelectors.TopupSecondStepSupport;
        break;
      case 3:
        event = ExolixSelectors.TopupThirdStepSupport;
        break;
      default:
        event = ExolixSelectors.TopupFourthStepSubmit;
        break;
    }

    return trackEvent(event, AnalyticsEventCategory.ButtonPress);
  }, [step, trackEvent]);

  return (
    <View>
      <Disclaimer
        title="Note"
        texts={[
          'For DOGE: transfer network - MainNet DOGE.',
          'Please, deposit only DOGE (MainNet).',
          'Otherwise, you may lose your assets',
          'permanently.'
        ]}
      />
      {/* <Stepper style={{ marginTop: '64px' }} steps={steps} currentStep={step} /> */}
      {step === 0 && <InitialStep isError={isError} setIsError={setIsError} />}
      {step === 1 && <ApproveStep isError={isError} setIsError={setIsError} />}
      {(step === 2 || step === 3 || step === 4) && <ExchangeStep isError={isError} setIsError={setIsError} />}
      {step >= 1 && (
        <TouchableOpacity
          onPress={() => {
            handleTrackSupportSubmit();
            openUrl(EXOLIX_CONTACT_LINK);
          }}
        >
          <Text>Support</Text>
        </TouchableOpacity>
      )}
      <Text>
        The token exchange feature is provided by a third party. The Temple wallet is not responsible for the work of
        third-party services.
      </Text>
    </View>
  );
};
