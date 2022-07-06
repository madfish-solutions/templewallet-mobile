import { useSelector } from 'react-redux';

import { ExolixRootState } from './exolix-state';

export const useExolixStep = () => useSelector<ExolixRootState, number>(({ step }) => step);

export const useExolixExchangeData = () =>
  useSelector<ExolixRootState, ExolixRootState['exchangeData']>(({ exchangeData }) => exchangeData);

export const useExolixCurrencies = () =>
  useSelector<ExolixRootState, ExolixRootState['currencies']>(({ currencies }) => currencies);
