import React from 'react';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TopUpOption } from '../../../components/top-up-option/top-up-option';
import { useAliceBobPairInfo } from '../../../hooks/use-alice-bob-pair-info';
import { useSignedMoonPayUrl } from '../../../hooks/use-signed-moonpay-url';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { openUrl } from '../../../utils/linking.util';

export const Debit = () => {
  const { navigate } = useNavigation();
  const { signedMoonPayUrl, isMoonPayError, isMoonPayDisabled } = useSignedMoonPayUrl();
  const { minAliceBobExchangeAmount, maxAliceBobExchangeAmount, isAliceBobError, isAliceBobDisabled } =
    useAliceBobPairInfo();

  return (
    <>
      <Divider size={formatSize(16)} />
      <TopUpOption
        title="Buy TEZ with MoonPay"
        iconName={IconNameEnum.MoonPay}
        onPress={() => openUrl(signedMoonPayUrl)}
        disabled={isMoonPayDisabled}
        isError={isMoonPayError}
      />
      <TopUpOption
        title="Buy TEZ with Alice-Bob (UAH only)"
        iconName={IconNameEnum.AliceBob}
        onPress={() =>
          navigate(ScreensEnum.AliceBob, { min: minAliceBobExchangeAmount, max: maxAliceBobExchangeAmount })
        }
        disabled={isAliceBobDisabled}
        isError={isAliceBobError}
      />
    </>
  );
};
