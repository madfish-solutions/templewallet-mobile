import React, { FC, useState } from 'react';

import { useExolixStep } from '../../../../store/exolix/exolix-selectors';
import { ApproveStep } from './approve-step';
import { ExchangeStep } from './exchange-step';
import { InitialStep } from './initial-step/initial-step';

export const Exolix: FC = () => {
  const step = useExolixStep();
  const [isError, setIsError] = useState(false);

  return (
    <>
      {step === 0 && <InitialStep isError={isError} setIsError={setIsError} />}
      {step === 1 && <ApproveStep isError={isError} setIsError={setIsError} />}
      {(step === 2 || step === 3 || step === 4) && <ExchangeStep isError={isError} setIsError={setIsError} />}
    </>
  );
};
