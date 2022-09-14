import React, { FC, useState } from 'react';

import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useExolixStep } from '../../../../store/exolix/exolix-selectors';
import { usePageAnalytic } from '../../../../utils/analytics/use-analytics.hook';
import { ApproveStep } from './steps/approve-step';
import { ExchangeStep } from './steps/exchange-step';
import { InitialStep } from './steps/initial-step/initial-step';

export const Exolix: FC = () => {
  const step = useExolixStep();
  const [isError, setIsError] = useState(false);
  usePageAnalytic(ScreensEnum.Exolix);

  return (
    <>
      {step === 0 && <InitialStep isError={isError} setIsError={setIsError} />}
      {step === 1 && <ApproveStep isError={isError} setIsError={setIsError} />}
      {(step === 2 || step === 3 || step === 4) && <ExchangeStep isError={isError} setIsError={setIsError} />}
    </>
  );
};
