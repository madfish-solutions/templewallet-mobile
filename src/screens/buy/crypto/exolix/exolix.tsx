import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadExolixCurrenciesAction } from 'src/store/exolix/exolix-actions';
import { useExolixStep } from 'src/store/exolix/exolix-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ApproveStep } from './steps/approve-step';
import { ExchangeStep } from './steps/exchange-step';
import { InitialStep } from './steps/initial-step/initial-step';

export const Exolix: FC = () => {
  const dispatch = useDispatch();
  const step = useExolixStep();
  const [isError, setIsError] = useState(false);
  usePageAnalytic(ScreensEnum.Exolix);

  useEffect(() => void dispatch(loadExolixCurrenciesAction.submit()), []);

  return (
    <>
      {step === 0 && <InitialStep isError={isError} setIsError={setIsError} />}
      {step === 1 && <ApproveStep isError={isError} setIsError={setIsError} />}
      {(step === 2 || step === 3 || step === 4) && <ExchangeStep isError={isError} setIsError={setIsError} />}
    </>
  );
};
